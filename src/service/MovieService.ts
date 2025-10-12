import axios from "axios";
import type { MovieModel } from "../models/movieModel";
import { movieCache } from "../utils/cache";

export async function getMovieById(id: number): Promise<MovieModel> {
  try {
    console.log("starting get movie by id");
    const res = await axios.get<MovieModel>(`/api/movies/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log("Done");
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    const response = await axios.get(`users/${userId}/favorites`);
    return response.data;
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
