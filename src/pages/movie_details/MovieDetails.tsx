import { useEffect, useState } from "react";
import styles from "./MovieDetails.module.css";
import { getMovieById } from "../../service/MovieService";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import type { MovieModel } from "../../models/movieModel";

function MovieDetails() {
  const { state } = useAuth();
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieModel | null>(null);

  useEffect(() => {
    if (movieId) {
      getMovieById(Number.parseFloat(movieId))
        .then((res: MovieModel) => {
          setMovie(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [movieId]);

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.mainContainer}>
          <div className={styles.imgContainer}>
            <img src={movie?.poster} alt={movie?.name} />
          </div>
          <h1>{movie?.name}</h1>
          <p>{movie?.description}</p>
          <p>Category: {movie?.category}</p>
          <p>{movie?.genres}</p>
          {movie?.screenshot.map((url) => {
            return (
              <img
                src={url}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  aspectRatio: "16/9",
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
