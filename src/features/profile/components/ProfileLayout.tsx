"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/user.service";
import { UserProfile } from "@/src/types/user.type";

export default function ProfileLayout() {
  const router = useRouter();

  // States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States (Thông tin)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "MALE",
  });

  // Form States (Mật khẩu)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load dữ liệu
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            fullName: res.data.fullName || "",
            phone: res.data.phone || "",
            dob: res.data.dob || "",
            gender: res.data.gender || "MALE",
          });
        }
      } catch (error) {
        console.error("Lỗi tải profile:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // Xử lý Lưu thay đổi
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Cập nhật thông tin cá nhân
      await userService.updateProfile(formData);

      // 2. Đổi mật khẩu (nếu người dùng có nhập)
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          setIsSaving(false);
          return;
        }
        await userService.changePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        });

        // Reset form mật khẩu sau khi đổi xong
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      alert("Cập nhật thông tin thành công!");
    } catch (error: any) {
      alert(
        error?.message || "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen pt-32 text-center text-primary">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* SIDEBAR TÁP VỤ */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl border border-white/5">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center text-3xl font-black text-primary ring-4 ring-primary/20 uppercase">
                  {profile?.fullName?.charAt(0) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full text-on-primary">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                </div>
              </div>
              <h2 className="font-headline font-bold text-xl text-white uppercase tracking-tight">
                {profile?.fullName}
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                {profile?.membership?.tier || "Thành viên Tiêu chuẩn"}
              </p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/profile"
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container group"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person
                </span>
                <span className="font-label font-bold text-sm uppercase tracking-wider">
                  Thông tin cá nhân
                </span>
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all group"
              >
                <span className="material-symbols-outlined">history</span>
                <span className="font-label font-bold text-sm uppercase tracking-wider">
                  Lịch sử đặt vé
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all group"
              >
                <span className="material-symbols-outlined">loyalty</span>
                <span className="font-label font-bold text-sm uppercase tracking-wider">
                  Điểm thưởng
                </span>
              </Link>
            </nav>
          </div>

          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs uppercase font-bold tracking-widest text-primary">
                Director's Points
              </span>
              <span className="text-2xl font-black font-headline text-primary italic">
                {profile?.membership?.points || 0}
              </span>
            </div>
            <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/4 shadow-[0_0_10px_rgba(245,201,72,0.5)]"></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3 text-center uppercase tracking-tighter">
              Tích lũy thêm điểm để thăng hạng
            </p>
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH: FORM THÔNG TIN */}
        <section className="lg:col-span-9">
          <h1 className="font-headline font-black text-4xl italic tracking-tighter text-white uppercase mb-10">
            Thông tin cá nhân
          </h1>

          <form onSubmit={handleSave} className="space-y-12">
            {/* Basic Info Section */}
            <div className="bg-surface-container-low p-8 rounded-xl space-y-8 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Họ và tên
                  </label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium"
                    placeholder="Nhập họ và tên"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Email (Không thể đổi)
                  </label>
                  <input
                    disabled
                    value={profile?.email || ""}
                    className="w-full bg-surface-container-high/50 border-none rounded-lg px-4 py-3 text-on-surface-variant cursor-not-allowed font-medium"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Số điện thoại
                  </label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Ngày sinh
                  </label>
                  <input
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium [color-scheme:dark]"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                  Giới tính
                </label>
                <div className="flex flex-wrap gap-8">
                  {["MALE", "FEMALE", "OTHER"].map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-5 h-5 text-primary bg-surface-container-high border-none focus:ring-offset-0 focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-on-surface-variant group-hover:text-white transition-colors">
                        {gender === "MALE"
                          ? "Nam"
                          : gender === "FEMALE"
                            ? "Nữ"
                            : "Khác"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="font-headline font-extrabold text-xl uppercase tracking-tight text-primary mb-8">
                Thay đổi mật khẩu
              </h3>
              <p className="text-xs text-on-surface-variant mb-6 -mt-4">
                Bỏ trống nếu bạn không muốn thay đổi mật khẩu.
              </p>

              <div className="space-y-6 max-w-md relative z-10">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Mật khẩu mới
                  </label>
                  <input
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary transition-all font-medium"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                disabled={isSaving}
                type="submit"
                className="w-full sm:w-auto px-12 py-4 bg-primary text-on-primary rounded-full font-label font-black text-sm uppercase tracking-widest hover:shadow-[0_0_25px_rgba(245,201,72,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang xử lý..." : "Lưu thay đổi"}
              </button>
              <button
                onClick={() => router.push("/")}
                type="button"
                className="w-full sm:w-auto px-12 py-4 border border-white/10 text-on-surface-variant rounded-full font-label font-bold text-sm uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
