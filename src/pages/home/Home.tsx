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
        }
      } catch (error) {
        console.error(`Failed to load ${selectedCategory}:`, error);
        if (!cancelled) {
          setMovies([]);
          setIsLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

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
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading state */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <p>Loading {selectedCategory} movies...</p>
        </div>
      )}

      {/* Movies grid */}
      {!isLoading && movies.length > 0 && (
        <div className={styles.movieContainer}>
          <ul>
            {movies.map((movie) => (
              <Link to={`movie/${movie.id}`} key={movie.id}>
                <Movie
                  id={movie.id}
                  title={movie.name}
                  description={movie.description}
                  posterUri={movie.posterUri}
                />
              </Link>
            ))}
          </ul>
        </div>
      )}

      {/* No movies message */}
      {!isLoading && movies.length === 0 && (
        <div className={styles.noMovies}>
          <p>No movies found in {selectedCategory} category.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
