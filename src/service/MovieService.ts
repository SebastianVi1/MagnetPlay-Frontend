import axios from "axios";
import type { MovieModel } from "../models/movieModel";
import { movieCache } from "../utils/cache";

export async function getMovieById(id: number): Promise<MovieModel> {
  try {
    const res = await axios.get<MovieModel>(`/api/movies/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log("Fetched movie with id: " + id);
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    // Temporary: use full URL for debugging
    const response = await axios.get(`api/users/${userId}/favorites`);
    console.log("Response:", response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.log("Failed to fetch favorite movies:", err);
    throw err;
  }
}

export const loadMoviesByCategory = async (category: string) => {
  const cacheKey = `movies_${category}`;

  // Check cache first
  const cachedData = movieCache.get(cacheKey);
  if (cachedData) {
    console.log(`📦 Using cached data for ${category}`);
    return cachedData;
  }

  console.log(`🌐 Fetching ${category} from API...`);

  let endpoint = "/api/movies";

  // Map categories to endpoints
  switch (category.toLowerCase()) {
    case "recent":
      endpoint = "/api/movies/recent";
      break;
    case "trending":
      endpoint = "/api/movies/trending";
      break;
    case "all":
      endpoint = "/api/movies";
      break;
  }

  const response = await axios.get<MovieModel[]>(endpoint);

  // Save to cache
  movieCache.set(cacheKey, response.data, 30); // 30 minutes

  return response.data;
};

// New function to preload all categories
export async function preloadAllCategories(
  categories: string[]
): Promise<void> {
  const promises = categories.map((category) =>
    loadMoviesByCategory(category).catch((err) => {
      console.error(`Failed to preload ${category}:`, err);
      return [];
    })
  );

  await Promise.all(promises);
}

export async function addToFavorites(userId: number, movieId: number) {
  try {
    const response = await axios.post(
      `/api/users/${userId}/favorites/${movieId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to add movie to favorites:", err);
    throw err;
  }
}

export async function removeFromFavorites(userId: number, movieId: number) {
  try {
    const response = await axios.delete(
      `/api/users/${userId}/favorites/${movieId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to remove movie from favorites:", err);
    throw err;
  }
}

export async function checkIfFavorite(
  userId: number,
  movieId: number
): Promise<boolean> {
  try {
    const response = await axios.get(
      `/api/users/${userId}/favorites/${movieId}/check`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to check favorite status:", err);
    return false;
  }
}
