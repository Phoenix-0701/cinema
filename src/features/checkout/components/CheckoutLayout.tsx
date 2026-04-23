"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkoutService } from "@/src/services/checkout.service";
import { ComboItem } from "@/src/types/checkout.type";
import { Seat } from "@/src/types/booking.type";

export default function CheckoutLayout() {
  const router = useRouter();

  // States lấy dữ liệu từ trang trước
  const [bookingData, setBookingData] = useState<{
    timeId: string;
    seats: Seat[];
    seatsTotal: number;
  } | null>(null);

  // States cho Combo & Thanh toán
  const [combos, setCombos] = useState<ComboItem[]>([
    {
      id: 1,
      name: "Director's Solo Combo",
      description: "1 Bắp L + 1 Nước ngọt L",
      price: 95000,
      quantity: 0,
      imageUrl: "https://i.ibb.co/3pQG6qX/vip-cinema.jpg",
    },
    {
      id: 2,
      name: "Couple Director's Cut",
      description: "1 Bắp lớn + 2 Nước ngọt L",
      price: 145000,
      quantity: 0,
      imageUrl: "https://i.ibb.co/3pQG6qX/vip-cinema.jpg",
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu ghế đã chọn từ session storage
    const data = sessionStorage.getItem("booking_temp_data");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      // Nếu không có dữ liệu (user vào thẳng link), đẩy về trang chủ
      router.push("/");
    }
  }, [router]);

  // Hàm xử lý tăng/giảm combo
  const updateComboQty = (id: number, delta: number) => {
    setCombos((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newQty = Math.max(0, c.quantity + delta);
          return { ...c, quantity: newQty };
        }
        return c;
      }),
    );
  };

  // Tính tổng tiền
  const combosTotal = combos.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const totalAmount = (bookingData?.seatsTotal || 0) + combosTotal;

  const handlePayment = async () => {
    if (!bookingData) return;
    setIsProcessing(true);

    try {
      // Payload gửi xuống BE
      const payload = {
        showtimeId: Number(bookingData.timeId),
        seatIds: bookingData.seats.map((s) => s.seatId),
        combos: combos
          .filter((c) => c.quantity > 0)
          .map((c) => ({ comboId: c.id, quantity: c.quantity })),
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
      };

      // GỌI API THỰC TẾ (Sẽ hoạt động khi BE chạy)
      // await checkoutService.createOrder(payload);

      // Tạm thời mô phỏng delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("🎉 Thanh toán thành công! Mã vé của bạn đã được gửi về email.");
      sessionStorage.removeItem("booking_temp_data"); // Xóa cache
      router.push("/"); // Đẩy về trang chủ hoặc trang lịch sử giao dịch
    } catch (error) {
      alert("Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData)
    return (
      <div className="min-h-screen bg-background pt-32 text-center text-white">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto min-h-screen bg-background text-on-surface">
      {/* Header Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2 text-white">
            BẮP NƯỚC & THANH TOÁN
          </h1>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>{" "}
              Chọn ghế
            </span>
            <span className="w-8 h-[1px] bg-surface-variant"></span>
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>{" "}
              Bắp nước
            </span>
            <span className="w-8 h-[1px] bg-surface-variant"></span>
            <span className="flex items-center gap-1 text-white">
              Thanh toán
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          {/* Combo Section */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              COMBO ƯU ĐÃI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="bg-surface-container-low p-4 rounded-xl flex gap-4 transition-all hover:bg-surface-container-high group border border-white/5"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={combo.imageUrl}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-white leading-tight">
                        {combo.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {combo.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-bold">
                        {combo.price.toLocaleString("vi-VN")}đ
                      </span>
                      <div className="flex items-center gap-3 bg-surface-container-highest px-2 py-1 rounded-full">
                        <button
                          onClick={() => updateComboQty(combo.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary hover:text-on-primary transition-colors text-white"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-white">
                          {combo.quantity}
                        </span>
                        <button
                          onClick={() => updateComboQty(combo.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-on-primary hover:opacity-80 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              PHƯƠNG THỨC THANH TOÁN
            </h2>
            <div className="space-y-3">
              {/* Momo */}
              <label
                className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === "MOMO" ? "border-primary bg-surface-container-high" : "border-transparent hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#a50064] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    MoMo
                  </div>
                  <span className="font-semibold text-white">
                    Ví điện tử MoMo
                  </span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="MOMO"
                  checked={paymentMethod === "MOMO"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary bg-surface-container-highest border-none focus:ring-offset-background"
                />
              </label>

              {/* VNPay */}
              <label
                className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === "VNPAY" ? "border-primary bg-surface-container-high" : "border-transparent hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                    <span className="text-blue-600 font-black text-xs">
                      VNPAY
                    </span>
                  </div>
                  <span className="font-semibold text-white">
                    VNPAY - Quét mã QR
                  </span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary bg-surface-container-highest border-none focus:ring-offset-background"
                />
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: TÓM TẮT ĐƠN HÀNG */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 glass-card rounded-2xl p-6 shadow-2xl border border-white/5">
            <h2 className="font-headline text-2xl font-black text-center mb-1 text-white uppercase">
              TÓM TẮT ĐƠN HÀNG
            </h2>
            <p className="text-xs text-primary font-bold text-center uppercase tracking-widest mb-6">
              DIRECTOR'S CUT THEATER
            </p>

            <div className="space-y-4 text-sm mb-8 border-b border-surface-variant pb-8 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Ghế chọn:</span>{" "}
                <span className="font-semibold text-primary">
                  {bookingData.seats
                    .map((s) => s.rowName + s.number)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiền ghế:</span>{" "}
                <span className="font-semibold text-white">
                  {bookingData.seatsTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {combos
                .filter((c) => c.quantity > 0)
                .map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span className="w-2/3 truncate">
                      {c.quantity}x {c.name}
                    </span>
                    <span className="font-semibold text-white">
                      {(c.price * c.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-2 mb-8 text-white">
              <div className="flex justify-between items-end pt-4">
                <span className="font-bold text-lg uppercase tracking-tighter">
                  Tổng cộng
                </span>
                <span className="font-headline text-3xl font-black text-primary">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-black text-lg tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {isProcessing ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
            </button>
            <p className="text-[10px] text-center text-on-surface-variant mt-4 leading-relaxed px-4">
              Bằng việc nhấn Thanh toán, bạn đồng ý với các Điều khoản & Chính
              sách của Cinema.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
