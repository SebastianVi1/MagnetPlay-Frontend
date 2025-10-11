import axios from "axios";
import type { MovieModel } from "../models/movieModel";

// Simple cache for movies
const movieCache: Record<string, MovieModel[]> = {};

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

export async function loadMoviesByCategory(
  category: string
): Promise<MovieModel[]> {
  try {
    const cacheKey = category.toLowerCase();

    // Check cache first
    if (movieCache[cacheKey]) {
      console.log(`✅ Using cached data for: ${category}`);
      return movieCache[cacheKey];
    }

    let endpoint = "/api/movies";

    // Map categories to endpoints - USE RELATIVE URLS
    switch (cacheKey) {
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

    console.log(`🌐 Fetching from: ${endpoint}`);

    const response = await axios.get<MovieModel[]>(endpoint);

    console.log(`✅ Loaded ${response.data.length} movies for ${category}`);

    // Save to cache
    movieCache[cacheKey] = response.data;

    return response.data;
  } catch (error) {
    console.error(`❌ Error loading ${category} movies:`, error);
    return [];
  }
}

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
