import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Movie from "../../components/movieCard/MovieCard";
import { Link } from "react-router-dom";
import { loadMoviesByCategory } from "../../service/MovieService";
import type { MovieModel } from "../../models/movieModel";

interface CategoryMovies {
  Recent: MovieModel[];
  Trending: MovieModel[];
  All: MovieModel[];
}

function Home() {
  const categoriesList: Array<string> = ["Recent", "Trending", "All"];
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoriesList[0]
  );

  // Store all categories in a single state object
  const [categoryMovies, setCategoryMovies] = useState<CategoryMovies>({
    Recent: [],
    Trending: [],
    All: [],
  });

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    Recent: true,
    Trending: true,
    All: true,
  });

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Preload all categories on mount
  useEffect(() => {
    let isMounted = true;

    const preloadAllCategories = async () => {
      if (!isMounted) return;
      
      console.log("🚀 Starting to preload all categories...");

      // Load all categories in parallel
      const loadPromises = categoriesList.map(async (category) => {
        try {
          if (!isMounted) return { category, movies: [] };
          
          console.log(`📥 Loading ${category}...`);
          const movies = await loadMoviesByCategory(category);
          
          if (!isMounted) return { category, movies: [] };
          
          console.log(`✅ ${category} loaded: ${movies.length} movies`);
          return { category, movies };
        } catch (error) {
          console.error(`❌ Failed to load ${category}:`, error);
          return { category, movies: [] };
        }
      });

      const results = await Promise.all(loadPromises);

      // Only update state if component is still mounted
      if (!isMounted) return;

      // Update state with all loaded movies
      const newCategoryMovies: CategoryMovies = {
        Recent: [],
        Trending: [],
        All: [],
      };

      const newLoadingState: Record<string, boolean> = {};

      results.forEach(({ category, movies }) => {
        newCategoryMovies[category as keyof CategoryMovies] = movies;
        newLoadingState[category] = false;
      });

      setCategoryMovies(newCategoryMovies);
      setIsLoading(newLoadingState);
      setInitialLoadComplete(true);

      console.log("✅ All categories preloaded successfully");
    };

    preloadAllCategories();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  // Get current category movies
  const currentMovies =
    categoryMovies[selectedCategory as keyof CategoryMovies] || [];
  const isCurrentCategoryLoading = isLoading[selectedCategory];

  return (
    <div className={styles.mainContainer}>
      {/* Category navigation bar */}
      <nav className={styles.categoryContainer}>
        <ul className={styles.categoryNav}>
          {categoriesList.map((category: string) => (
            <li
              key={category}
              className={`${styles.categoryList} ${
                selectedCategory === category ? styles.selected : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </nav>

      {/* Show loading indicator */}
      {!initialLoadComplete && (
        <div className={styles.loadingIndicator}>
          <p>Loading all categories...</p>
        </div>
      )}

      {/* Show category specific loading */}
      {initialLoadComplete && isCurrentCategoryLoading && (
        <div className={styles.loadingIndicator}>
          <p>Loading {selectedCategory} movies...</p>
        </div>
      )}

      {/* Render movies */}
      {initialLoadComplete &&
        !isCurrentCategoryLoading &&
        currentMovies.length > 0 && (
          <div className={styles.movieContainer}>
            <ul>
              {currentMovies.map((m: MovieModel) => (
                <Link to={`movie/${m.id}`} key={m.id}>
                  <Movie
                    id={m.id}
                    title={m.name}
                    description={m.description}
                    posterUri={m.posterUri}
                  />
                </Link>
              ))}
            </ul>
          </div>
        )}

      {/* Show message when no movies found */}
      {initialLoadComplete &&
        !isCurrentCategoryLoading &&
        currentMovies.length === 0 && (
          <div className={styles.noMovies}>
            <p>No movies found in {selectedCategory} category.</p>
          </div>
        )}
    </div>
  );
}

export default Home;
