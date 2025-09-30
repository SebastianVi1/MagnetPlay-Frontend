import { useEffect, useState } from "react";
import styles from "./MovieDetails.module.css";
import { getMovieById } from "../../service/MovieService";
import { useParams } from "react-router-dom";
import type { MovieModel } from "../../models/movieModel";

function MovieDetails() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

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
          // Use movieId to construct dynamic video URl
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [movieId]);

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
            <img src={movie.poster} alt={movie.name} />
          </div>

          <div className={styles.movieInfo}>
            <h1 className={styles.movieTitle}>{movie.name}</h1>
            <p className={styles.movieDuration}>1H 43M</p>
            <div className={styles.genresContainer}>
              {movie.genres.map((genre, idx) => (
                <p key={idx}>{genre}</p>
              ))}
            </div>

            <div className={styles.movieSynopsis}>
              <p>
                {movie.description != null
                  ? movie.description
                  : "No description"}
              </p>
            </div>

            <div className={styles.videoPlayerContainer}>
              {/* Enhanced video player with controls and responsive design */}
              <video
                src={videoUrl}
                controls
                controlsList="nodownload"
                playsInline
                poster={movie.screenshot?.[1]}
              >
                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src="http://localhost:3000/api/subtitles/movie.en.vtt"
                />
                <track
                  label="Spanish"
                  kind="subtitles"
                  srcLang="es"
                  src="http://localhost:3000/api/subtitles/movie.es.vtt"
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
