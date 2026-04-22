import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from "../lib/token";

// Lấy Base URL từ biến môi trường hoặc dùng mặc định của Spring Boot
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR: Tự động gắn Access Token vào header trước khi gửi
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Biến cờ và hàng đợi để xử lý Refresh Token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. RESPONSE INTERCEPTOR: Xử lý lỗi 401 và tự động Refresh Token
api.interceptors.response.use(
  // Nếu request thành công, trả về luôn cục data bên trong (Bỏ qua vỏ axios response)
  (response) => response.data,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Bỏ qua nếu là request tới API login hoặc refresh để tránh lặp vô hạn
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 (Hết hạn Token) và chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đưa các request khác vào hàng đợi (Queue)
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeTokens();
        window.location.href = "/login"; // Đẩy về trang đăng nhập
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token (Gọi bằng axios thuần để không bị dính vào interceptor)
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Theo chuẩn ApiResponse của bạn, JWT trả về nằm trong data.data
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Lưu token mới
        setTokens(newAccessToken, newRefreshToken);

        // Cập nhật token cho request hiện tại và các request trong Queue
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Chạy lại request ban đầu vừa bị lỗi
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token cũng hết hạn hoặc lỗi -> Xóa token, đẩy về trang Login
        processQueue(refreshError, null);
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý ném lỗi (Ném ra response.data để lấy được câu message từ Spring Boot)
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
