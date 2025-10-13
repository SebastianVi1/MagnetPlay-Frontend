import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Search.module.css";
import Movie from "../movieCard/MovieCard";
import type { MovieModel } from "../../models/movieModel";
import { useDebounce } from "../../hooks/useDebounce";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Search function using axios
  const searchMovies = async (query: string): Promise<MovieModel[]> => {
    try {
      const response = await axios.get<MovieModel[]>(`/api/movies/search`, {
        params: { name: query },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Search failed: ${error.message}`);
      }
      throw new Error("Search failed");
    }
  };

  // Effect to search when debounced term changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    let cancelled = false;

    const performSearch = async () => {
      setIsLoading(true);
      setHasSearched(true);

      try {
        const results = await searchMovies(debouncedSearchTerm);

        if (!cancelled) {
          setMovies(results);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (!cancelled) {
          setMovies([]);
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setMovies([]);
    setHasSearched(false);
  };

  const showResults = hasSearched && !isLoading;
  const showNoResults = showResults && movies.length === 0;

  return (
    <div className={styles.mainContainer}>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchIcon}>🔍</div>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Searching for "{debouncedSearchTerm}"...</p>
        </div>
      )}

      {/* No Search Yet */}
      {!hasSearched && !isLoading && (
        <div className={styles.emptyState}>
          <p>Start typing to search for movies</p>
          <p className={styles.searchTip}>
            Try searching for titles, genres, or actors
          </p>
        </div>
      )}

      {/* No Results */}
      {showNoResults && (
        <div className={styles.noResults}>
          <p>No movies found for "{debouncedSearchTerm}"</p>
          <p className={styles.searchTip}>
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* Results */}
      {showResults && movies.length > 0 && (
        <div className={styles.resultsContainer}>
          <ul className={styles.resultsGrid}>
            {movies.map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div
                  className={styles.movieItem}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Movie
                    id={movie.id}
                    title={movie.name}
                    description={movie.description}
                    posterUri={movie.posterUri}
                  />
                </div>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
