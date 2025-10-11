import axios from "axios";
import type { MovieModel } from "../models/movieModel";

// Simple in-memory cache for movies to avoid repeated API calls
const movieCache: Record<string, MovieModel[]> = {};

/**
 * Fetches a single movie by its ID
 * @param id - The movie ID
 * @returns Promise<MovieModel> - The movie data
 */
export async function getMovieById(id: number): Promise<MovieModel> {
  try {
    const response = await axios.get<MovieModel>(`/api/movies/${id}`);
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches favorite movies for a specific user
 * @param userId - The user ID
 * @returns Promise<any> - The favorite movies data
 */
export async function getFavoriteMovies(userId: number) {
  try {
    const response = await axios.get(`/api/users/${userId}/favorites`);
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch favorite movies for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Loads movies by category with caching and error handling
 * @param category - The movie category (recent, trending, all)
 * @returns Promise<MovieModel[]> - Array of movies for the category
 */
export async function loadMoviesByCategory(
  category: string
): Promise<MovieModel[]> {
  try {
    const cacheKey = category.toLowerCase();

    // Check cache first to avoid unnecessary API calls
    if (movieCache[cacheKey]) {
      return movieCache[cacheKey];
    }

    // Map categories to their respective API endpoints
    let endpoint = "/api/movies";
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

    const response = await axios.get<MovieModel[]>(endpoint);

    // Validate response
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format: expected array of movies");
    }

    // Save to cache for future requests
    movieCache[cacheKey] = response.data;

    return response.data;
  } catch (error) {
    console.error(`Error loading ${category} movies:`, error);
    
    // Return empty array to prevent UI crashes
    return [];
  }
}

/**
 * Preloads all specified categories in parallel for better performance
 * @param categories - Array of category names to preload
 * @returns Promise<void>
 */
export async function preloadAllCategories(
  categories: string[]
): Promise<void> {
  const promises = categories.map((category) =>
    loadMoviesByCategory(category).catch((error) => {
      console.error(`Failed to preload ${category}:`, error);
      return [];
    })
  );

  await Promise.all(promises);
}

/**
 * Clears the movie cache - useful for testing or forcing fresh data
 */
export function clearMovieCache(): void {
  Object.keys(movieCache).forEach(key => delete movieCache[key]);
}
