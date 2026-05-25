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
import placeholder from "../../assets/video-placeholder.jpg";

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function MovieDetails() {
  const { movieId } = useParams<{ movieId: string }>();
  const { state, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false);
  const uriStream =
    import.meta.env.VITE_STREAMING_URL ?? "http://streaming-api:3000";

  useEffect(() => {
    if (movieId) {
      getMovieById(Number.parseFloat(movieId))
        .then((res: MovieModel) => {
          setMovie(res);
          setVideoUrl(
            `${uriStream}/api/torrent/${encodeURIComponent(res.magnetUri)}`
          );

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
  }, [movieId, isAuthenticated, state.user?.id, uriStream]);

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

  const backdropSrc = movie.tmdbBackdropUrl ?? movie.screenshot?.[0];
  const posterSrc = movie.tmdbPosterUrl ?? movie.posterUri;
  const overview = movie.tmdbOverview ?? movie.description;
  const year = movie.releaseDate
    ? movie.releaseDate.slice(0, 4)
    : null;
  const rating = movie.tmdbRating;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.mainContent}>
        <div className={styles.backgroundImage}>
          {backdropSrc && (
            <img src={backdropSrc} alt="Background" />
          )}
        </div>
        <div className={styles.movieContent}>
          <div className={styles.moviePoster}>
            <img
              src={posterSrc}
              alt={movie.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (movie.tmdbPosterUrl && target.src !== movie.posterUri) {
                  target.src = movie.posterUri;
                }
              }}
            />
          </div>

          <div className={styles.movieInfo}>
            <div className={styles.titleContainer}>
              <h1 className={styles.movieTitle}>{movie.name}</h1>

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

            <div className={styles.metadataRow}>
              {year && <span className={styles.movieYear}>{year}</span>}
              {movie.runtime != null && movie.runtime > 0 && (
                <span className={styles.movieDuration}>
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {rating != null && rating > 0 && (
                <span className={styles.tmdbRating}>
                  {"\u2B50"} {rating.toFixed(1)} / 10
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genresContainer}>
                {movie.genres.map((genre, idx) => (
                  <p key={idx}>{genre}</p>
                ))}
              </div>
            )}

            <div className={styles.movieSynopsis}>
              <p>{overview != null ? overview : "No description"}</p>
            </div>

            <div className={styles.videoPlayerContainer}>
              <video
                src={videoUrl}
                controls
                controlsList="nodownload"
                playsInline
                poster={placeholder}
              >
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
