import { useEffect, useState } from "react";
import styles from "./Favorites.module.css";
import { getFavoriteMovies } from "../../service/MovieService";
import { useAuth } from "../../hooks/useAuth";
import type { MovieModel } from "../../models/movieModel";

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
          setMovieList(movies);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching favorites:", err);
          setError("Failed to load favorites");
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
  if (isAuthenticated() && movieList.length === 0) {
    return (
      <div className={styles.emptyListContainer}>
        <h1>Add some movies first</h1>
      </div>
    );
  }

  // Show favorites if they exist
  if (movieList.length > 0) {
    return (
      <div className={styles.moviesContainer}>
        <h2>Favorites</h2>
        {/* Render the movie list here */}
        <div>You have {movieList.length} favorite movies</div>
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
