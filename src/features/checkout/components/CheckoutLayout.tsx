"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkoutService } from "@/src/services/checkout.service";
import { ComboItem } from "@/src/types/checkout.type";
import { Seat } from "@/src/types/booking.type";
import Link from "next/link";

export default function CheckoutLayout() {
  const router = useRouter();

  // --- 1. STATES ---
  const [bookingData, setBookingData] = useState<{
    timeId: string;
    seats: Seat[];
    seatsTotal: number;
    movieName?: string;
    showtimeInfo?: string;
  } | null>(null);

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
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 2. EFFECTS ---
  useEffect(() => {
    // Lấy dữ liệu từ bước chọn ghế
    const data = sessionStorage.getItem("booking_temp_data");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      // Nếu không có dữ liệu, quay lại trang chủ
      router.push("/");
    }
  }, [router]);

  // --- 3. LOGIC HANDLERS ---
  const updateComboQty = (id: number, delta: number) => {
    setCombos((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, quantity: Math.max(0, c.quantity + delta) };
        }
        return c;
      }),
    );
  };

  const combosTotal = combos.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const totalAmount = (bookingData?.seatsTotal || 0) + combosTotal;

  const handlePayment = async () => {
    if (!bookingData) return;
    setIsProcessing(true);

    try {
      const payload = {
        showtimeId: Number(bookingData.timeId),
        seatIds: bookingData.seats.map((s) => s.seatId),
        combos: combos
          .filter((c) => c.quantity > 0)
          .map((c) => ({ comboId: c.id, quantity: c.quantity })),
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
      };

      // Gọi API thực tế tới Spring Boot
      await checkoutService.createOrder(payload);

      // Xóa dữ liệu tạm sau khi đặt vé thành công
      sessionStorage.removeItem("booking_temp_data");
      setIsSuccess(true);
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto min-h-screen bg-background text-on-surface relative">
      {/* MODAL THÀNH CÔNG */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-surface-container-low border border-white/10 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-headline font-black text-white mb-2 uppercase italic tracking-tighter">
              Thanh Toán Thành Công!
            </h2>
            <p className="text-on-surface-variant text-sm mb-8">
              Cảm ơn bạn đã tin tưởng Director’s Cut. Mã vé điện tử đã được kích
              hoạt trong hệ thống.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PROGRESS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2 text-white">
            BẮP NƯỚC & THANH TOÁN
          </h1>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant uppercase font-bold tracking-widest">
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

        <div className="bg-surface-container-high px-6 py-3 rounded-xl border border-primary/20 flex items-center gap-4 self-start">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Thời gian giữ vé
            </span>
            <span className="font-headline text-2xl font-black text-primary leading-none">
              05:00
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: COMBO & THANH TOÁN */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section: Combo */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline text-xl font-bold tracking-widest uppercase text-white">
                Combo Ưu Đãi
              </h2>
            </div>
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

          {/* Section: Phương thức thanh toán */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "MOMO",
                  name: "Ví điện tử MoMo",
                  brand: "MOMO",
                  color: "bg-[#a50064]",
                },
                {
                  id: "VNPAY",
                  name: "VNPAY - Quét mã QR",
                  brand: "VNPAY",
                  color: "bg-white text-blue-600",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer border-2 transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-surface-container-high"
                      : "border-transparent hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-10 ${method.color} rounded-lg flex items-center justify-center font-black text-[10px] uppercase shadow-inner`}
                    >
                      {method.brand}
                    </div>
                    <span className="font-semibold text-white">
                      {method.name}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary bg-surface-container-highest border-none focus:ring-offset-background"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 glass-card rounded-2xl p-6 shadow-2xl border border-white/5">
            <h2 className="font-headline text-2xl font-black text-center mb-1 text-white uppercase italic tracking-tighter">
              TÓM TẮT ĐƠN HÀNG
            </h2>
            <p className="text-xs text-primary font-bold text-center uppercase tracking-[0.3em] mb-6">
              Director’s Cut
            </p>

            <div className="space-y-4 text-sm mb-8 border-b border-white/10 pb-8 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Ghế đã chọn:</span>
                <span className="font-bold text-primary">
                  {bookingData.seats
                    .map((s) => s.rowName + s.number)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiền ghế:</span>
                <span className="font-semibold text-white">
                  {bookingData.seatsTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {combos
                .filter((c) => c.quantity > 0)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between animate-in fade-in slide-in-from-right-2"
                  >
                    <span className="w-2/3 truncate">
                      {c.quantity}x {c.name}
                    </span>
                    <span className="font-semibold text-white">
                      {(c.price * c.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-end pt-4">
                <span className="font-bold text-lg uppercase tracking-tighter text-white">
                  Tổng thanh toán
                </span>
                <span className="font-headline text-3xl font-black text-primary animate-in fade-in duration-500">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-black text-lg tracking-widest uppercase shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </>
              ) : (
                "THANH TOÁN NGAY"
              )}
            </button>

            <p className="text-[10px] text-center text-on-surface-variant mt-6 leading-relaxed px-4 italic">
              Bằng việc nhấn Thanh toán, bạn đồng ý với các Điều khoản & Chính
              sách bảo mật của Cinema Director’s Cut.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
