import React from "react";
import {
  MovieHeroSection,
  MovieShowtimesSection,
} from "@/src/features/movie-detail";

// Định nghĩa params cho Next.js App Router
export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = params.id; // Lấy ID từ thanh địa chỉ (vd: /movie/5 -> id là "5")

  return (
    <main className="relative w-full pt-20">
      {/* Truyền movieId xuống các Component để chúng tự fetch dữ liệu */}
      <MovieHeroSection movieId={movieId} />
      <MovieShowtimesSection movieId={movieId} />
    </main>
  );
}
