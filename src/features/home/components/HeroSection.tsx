import React from "react";

export default function HeroSection() {
  return (
    <section className="relative h-[870px] w-full overflow-hidden flex items-end px-12 pb-24">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="Dune Part Two Background"
          src="https://i.ibb.co/C0wV91B/dune-poster.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase">
            IMAX 3D
          </span>
          <span className="text-on-surface-variant text-sm font-medium">
            Khởi chiếu: 24.05.2024
          </span>
        </div>
        <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-none italic text-primary">
          DUNE: PART TWO
        </h1>
        <p className="font-body text-lg text-on-surface/80 max-w-xl leading-relaxed">
          Hành trình huyền thoại tiếp tục khi Paul Atreides hợp lực với Chani và
          người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.
        </p>
        <div className="flex items-center space-x-4 pt-4">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label font-bold text-base flex items-center space-x-2 hover:shadow-[0_0_20px_rgba(245,201,72,0.4)] transition-all scale-95 active:scale-90">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              confirmation_number
            </span>
            <span>ĐẶT VÉ NGAY</span>
          </button>
          <button className="bg-transparent border border-on-surface/20 text-on-surface px-8 py-4 rounded-full font-label font-bold text-base flex items-center space-x-2 hover:bg-on-surface/10 transition-all scale-95 active:scale-90">
            <span className="material-symbols-outlined">play_circle</span>
            <span>XEM TRAILER</span>
          </button>
        </div>
      </div>

      {/* Side Bento Highlight */}
      <div className="absolute right-12 bottom-24 hidden xl:grid grid-cols-1 gap-4 w-72 z-10">
        <div className="glass-card p-4 rounded-xl border border-white/5 space-y-2">
          <p className="text-xs text-primary font-bold uppercase tracking-widest">
            Đang thịnh hành
          </p>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-16 bg-surface-container-high rounded overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Oppenheimer"
                src="https://i.ibb.co/311W3cZ/oppenheimer.jpg"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold line-clamp-1">Oppenheimer</h4>
              <div className="flex items-center text-xs text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-[14px] text-primary mr-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                8.9/10
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-on-surface-variant font-medium">
              Giá vé từ
            </p>
            <p className="text-xl font-bold text-primary">85.000đ</p>
          </div>
          <span className="material-symbols-outlined text-primary-container">
            local_activity
          </span>
        </div>
      </div>
    </section>
  );
}
