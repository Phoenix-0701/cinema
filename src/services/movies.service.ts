import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { Movie, Showtime } from "../types/movie.type";

export const movieService = {
  // 1. Phim đang chiếu (NOW SHOWING)
  getNowShowing: () => {
    return api.get<any, ApiResponse<Movie[]>>("/movies/now-showing");
  },

  // 2. Phim sắp chiếu (COMING SOON) - ĐÂY LÀ HÀM BẠN BỊ THIẾU
  getComingSoon: () => {
    // Tạm giả định API là /movies/coming-soon (bạn có thể đổi lại cho khớp với BE thật)
    return api.get<any, ApiResponse<Movie[]>>("/movies/coming-soon");
  },

  // 3. Lấy chi tiết 1 bộ phim
  getMovieById: (movieId: number | string) => {
    return api.get<any, ApiResponse<Movie>>(`/movies/${movieId}`);
  },

  // 4. Lấy lịch chiếu của 1 bộ phim
  getMovieShowtimes: (movieId: number | string) => {
    return api.get<any, ApiResponse<Showtime[]>>(
      `/movies/${movieId}/showtimes`,
    );
  },
};
