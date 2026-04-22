import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { Movie } from "../types/movie.type";

export const movieService = {
  getNowShowing: () => {
    // Gọi API: GET /api/v1/movies/now-showing
    return api.get<any, ApiResponse<Movie[]>>("/movies/now-showing");
  },
};
