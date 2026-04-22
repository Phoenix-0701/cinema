import api from "./api";
import { setTokens, removeTokens } from "../lib/token";
import { ApiResponse, JwtResponse } from "../types/auth.type";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // Ép kiểu (cast) về ApiResponse<JwtResponse>
    const response = await api.post<any, ApiResponse<JwtResponse>>(
      "/auth/login",
      {
        ...credentials,
        provider: "LOCAL",
      },
    );

    // Nếu thành công, lưu token tự động
    if (response.success && response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      // Dù API có lỗi hay không cũng phải xóa token trên local
      removeTokens();
      window.location.href = "/login";
    }
  },

  getMe: async () => {
    return api.get("/auth/me");
  },
};
