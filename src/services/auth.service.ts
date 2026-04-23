import api from "./api";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ApiResponse,
  User,
} from "../types/auth.type";

export const authService = {
  login: (data: LoginPayload) => {
    return api.post<any, ApiResponse<AuthResponse>>("/auth/login", data);
  },

  register: (data: RegisterPayload) => {
    return api.post<any, ApiResponse<AuthResponse>>("/auth/register", data);
  },

  // THÊM HÀM NÀY ĐỂ LẤY THÔNG TIN USER TỪ JWT TOKEN
  getMe: () => {
    return api.get<any, ApiResponse<User>>("/auth/me");
  },
};
