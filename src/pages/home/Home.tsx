import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Movie from "../../components/movieCard/MovieCard";
import { Link } from "react-router-dom";
import { loadMoviesByCategory } from "../../service/MovieService";
import type { MovieModel } from "../../models/movieModel";

function Home() {
  const categoriesList = ["Recent", "Trending", "All"];
  const [selectedCategory, setSelectedCategory] = useState(categoriesList[0]);
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle category change with animation
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === selectedCategory) return;

    // 1. Activar animación de salida
    setIsTransitioning(true);

    // 2. Cambiar contenido después del fade out
    setTimeout(() => {
      setSelectedCategory(newCategory);
    }, 150); // Tiempo del fade out
  };

  // Simple effect that loads movies when category changes
  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      setIsLoading(true);

      try {
        const movieData = await loadMoviesByCategory(selectedCategory);

        if (!cancelled) {
          setMovies(Array.isArray(movieData) ? movieData : []);
          setIsLoading(false);

          // End transition after content loads
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }
      } catch (error) {
        console.error(`Failed to load ${selectedCategory}:`, error);
        if (!cancelled) {
          setMovies([]);
          setIsLoading(false);
          setIsTransitioning(false);
        }
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const showContent = !isLoading && !isTransitioning;
  const showMovies = showContent && movies.length > 0;
  const showNoMovies = showContent && movies.length === 0;

  return (
    <div className={styles.mainContainer}>
      {/* Category navigation */}
      <nav className={styles.categoryContainer}>
        <ul className={styles.categoryNav}>
          {categoriesList.map((category) => (
            <li
              key={category}
              className={`${styles.categoryList} ${
                selectedCategory === category ? styles.selected : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading state */}
      {(isLoading || isTransitioning) && (
        <div className={`${styles.loadingIndicator} ${styles.fadeIn}`}>
          <p>Loading {selectedCategory} movies...</p>
        </div>
      )}

      {/* Movies grid */}
      {showMovies && (
        <div className={`${styles.movieContainer} ${styles.fadeInUp}`}>
          <ul>
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={styles.movieItem}
                style={{ animationDelay: `${index * 0.1}s` }} /* Cada item 100ms después */
              >
                <Link to={`movie/${movie.id}`}>
                  <Movie
                    id={movie.id}
                    title={movie.name}
                    description={movie.description}
                    posterUri={movie.posterUri}
                    tmdbPosterUrl={movie.tmdbPosterUrl}
                    tmdbRating={movie.tmdbRating}
                    releaseDate={movie.releaseDate}
                  />
                </Link>
              </div>
            ))}
          </ul>
        </div>
      )}

      {/* No movies message */}
      {showNoMovies && (
        <div className={`${styles.noMovies} ${styles.fadeIn}`}>
          <p>No movies found in {selectedCategory} category.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
