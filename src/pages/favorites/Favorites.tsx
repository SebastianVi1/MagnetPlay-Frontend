import { useEffect, useState } from "react";
import styles from "./Favorites.module.css";
import { getFavoriteMovies } from "../../service/UserService";
import { useAuth } from "../../hooks/useAuth";
import type { Movie } from "../../models/movieModel";

function Favorites() {
  const { state, isAuthenticated } = useAuth();
  const [movieList, setMovieList] = useState<Array<Movie>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getFavoriteMovies(state.user?.id);
  });

  // the user is authenticated but has no favorites
  if (movieList.length == 0) {
    return (
      <>
        <div className={styles.emptyListContainer}>
          <h1>Add some movies first</h1>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={styles.moviesContainer}>
        <h2>Favorites</h2>
      </div>
    </>
  );
}

export default Favorites;
