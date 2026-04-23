export interface ComboItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number; // Dùng cho UI để lưu số lượng khách chọn
}

export interface OrderPayload {
  showtimeId: number;
  seatIds: number[]; // Danh sách ID ghế
  combos: { comboId: number; quantity: number }[]; // Các combo đã mua
  paymentMethod: string; // MOMO, VNPAY, CREDIT_CARD
  totalAmount: number;
}
