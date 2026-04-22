import React from "react";
import { Movie } from "../types/movie.type"; // Giả sử bạn đã tạo file type

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container-low shadow-xl cursor-pointer">
      {/* Poster */}
      <img
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt={movie.mName}
        src={movie.posterUrl || "https://via.placeholder.com/300x450"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

      {/* Badges - Lấy từ dữ liệu thật */}
      <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
        <span
          className="material-symbols-outlined text-[12px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <span>8.5</span>{" "}
        {/* Tạm thời fix cứng vì Entity Movie chưa có Rating */}
      </div>

      <div className="absolute top-3 right-3 bg-secondary-container text-white px-2 py-1 rounded text-[10px] font-bold">
        {movie.ageRating}
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-headline font-bold text-lg mb-1 leading-tight text-white uppercase group-hover:text-primary transition-colors line-clamp-2">
          {movie.mName}
        </h3>

        {/* Render thể loại */}
        <p className="text-xs text-on-surface-variant mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {movie.genres?.map((g) => g.genre).join(", ")}
        </p>

        {/* Action Button - Hướng tới /movies/{id} */}
        <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm tracking-widest flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          <span>MUA VÉ</span>
        </button>
      </div>
    </div>
  );
}
