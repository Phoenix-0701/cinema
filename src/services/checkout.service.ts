import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { ComboItem, OrderPayload } from "../types/checkout.type";

export const checkoutService = {
  // Lấy danh sách bắp nước (Giả định endpoint)
  getCombos: () => {
    return api.get<any, ApiResponse<ComboItem[]>>("/products/combos");
  },

  // Tạo đơn hàng và thanh toán
  createOrder: (payload: OrderPayload) => {
    return api.post<any, ApiResponse<any>>("/orders", payload);
  },
};
