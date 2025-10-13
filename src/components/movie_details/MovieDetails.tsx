import { useEffect, useState } from "react";
import styles from "./MovieDetails.module.css";
import {
  getMovieById,
  addToFavorites,
  removeFromFavorites,
  checkIfFavorite,
} from "../../service/MovieService";
import { useParams } from "react-router-dom";
import type { MovieModel } from "../../models/movieModel";
import { useAuth } from "../../hooks/useAuth";

function MovieDetails() {
  const { movieId } = useParams<{ movieId: string }>();
  const { state, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (movieId) {
      getMovieById(Number.parseFloat(movieId))
        .then((res: MovieModel) => {
          setMovie(res);
          setVideoUrl(
            `http://localhost:3000/api/torrent/${encodeURIComponent(
              res.magnetUri
            )}`
          );

          // Check if movie is in favorites
          if (isAuthenticated() && state.user?.id) {
            checkIfFavorite(state.user.id, res.id)
              .then(setIsFavorite)
              .catch(console.error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [movieId, isAuthenticated, state.user?.id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated() || !state.user?.id || !movie) {
      alert("Please log in to add favorites");
      return;
    }

    setIsLoadingFavorite(true);

    try {
      if (isFavorite) {
        await removeFromFavorites(state.user.id, movie.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(state.user.id, movie.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites. Please try again.");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  if (!movie) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Movie...</p>
      </div>
    );
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContent}>
        <div className={styles.backgroundImage}>
          {movie.screenshot && movie.screenshot.length > 0 && (
            <img src={movie.screenshot[0]} alt="Background" />
          )}
        </div>
        <div className={styles.movieContent}>
          <div className={styles.moviePoster}>
            <img src={movie.posterUri} alt={movie.name} />
          </div>

          <div className={styles.movieInfo}>
            <div className={styles.titleContainer}>
              <h1 className={styles.movieTitle}>{movie.name}</h1>

              {/* Favorite Button */}
              <button
                className={`${styles.favoriteButton} ${
                  isFavorite ? styles.favorited : ""
                }`}
                onClick={handleFavoriteToggle}
                disabled={isLoadingFavorite || !isAuthenticated()}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isLoadingFavorite ? (
                  <span className={styles.loadingIcon}>⏳</span>
                ) : (
                  <span className={styles.heartIcon}>
                    {isFavorite ? "❤️" : "🤍"}
                  </span>
                )}
              </button>
            </div>
            {}

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genresContainer}>
                {movie.genres.map((genre, idx) => (
                  <p key={idx}>{genre}</p>
                ))}
              </div>
            )}

            <div className={styles.movieSynopsis}>
              <p>
                {movie.description != null
                  ? movie.description
                  : "No description"}
              </p>
            </div>

            <div className={styles.videoPlayerContainer}>
              <video
                src={videoUrl}
                controls
                controlsList="nodownload"
                playsInline
                poster={movie.screenshot?.[1]}
              >
                {/* Use relative URLs for subtitles too */}
                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src="/api/subtitles/movie.en.vtt"
                />
                <track
                  label="Spanish"
                  kind="subtitles"
                  srcLang="es"
                  src="/api/subtitles/movie.es.vtt"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
