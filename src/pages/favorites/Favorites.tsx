import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Favorites.module.css";
import { getFavoriteMovies } from "../../service/MovieService";
import { useAuth } from "../../hooks/useAuth";
import type { MovieModel } from "../../models/movieModel";
import Movie from "../../components/movieCard/MovieCard";

function Favorites() {
  const { state, isAuthenticated } = useAuth();
  const [movieList, setMovieList] = useState<Array<MovieModel>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated() && state.user?.id) {
      setLoading(true);
      setError(null);
      getFavoriteMovies(state.user.id)
        .then((movies) => {
          // Backend returns array directly now
          setMovieList(Array.isArray(movies) ? movies : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching favorites:", err);
          setError("Failed to load favorites");
          setMovieList([]);
          setLoading(false);
        });
    }
  }, [isAuthenticated, state.user?.id]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.emptyListContainer}>
        <h1>Loading favorites...</h1>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.emptyListContainer}>
        <h1>Error loading favorites</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state if user is authenticated but has no favorites
  if (
    isAuthenticated() &&
    Array.isArray(movieList) &&
    movieList.length === 0 &&
    !loading
  ) {
    return (
      <div className={styles.emptyListContainer}>
        <h1>Add some movies first</h1>
      </div>
    );
  }

  // Show favorites if they exist
  if (Array.isArray(movieList) && movieList.length > 0) {
    return (
      <div className={styles.moviesContainer}>
        <h2>Your Favorite Movies</h2>
        <div className={styles.movieGrid}>
          {movieList.map((movie: MovieModel, index) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div
                className={styles.movieItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Movie
                  id={movie.id}
                  title={movie.name}
                  description={movie.description}
                  posterUri={movie.posterUri}
                  tmdbPosterUrl={movie.tmdbPosterUrl}
                  tmdbRating={movie.tmdbRating}
                  releaseDate={movie.releaseDate}
                />
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.favoriteCount}>
          You have {movieList.length} favorite movies
        </div>
      </div>
    );
  }

  // Default state (user not authenticated)
  return (
    <div className={styles.emptyListContainer}>
      <h1>Please log in to view your favorites</h1>
    </div>
  );
}

export default Favorites;
