import styles from "./Movie.module.css";

interface MovieProps {
  id: number;
  title: string;
  posterUri: string;
  description?: string;
  tmdbPosterUrl?: string;
  tmdbRating?: number;
  releaseDate?: string;
}

function Movie({
  title,
  posterUri,
  description,
  tmdbPosterUrl,
  tmdbRating,
  releaseDate,
}: MovieProps) {
  const poster = tmdbPosterUrl ?? posterUri;
  const year = releaseDate ? releaseDate.slice(0, 4) : null;

  return (
    <li className={styles.card} tabIndex={0}>
      <div className={styles.imageContainer}>
        <img
          src={poster}
          alt={title + " poster"}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (tmdbPosterUrl && target.src !== posterUri) {
              target.src = posterUri;
            } else {
              target.style.display = "none";
              target.parentElement!.style.background = "#2a2d35";
            }
          }}
        />
        {tmdbRating != null && tmdbRating > 0 && (
          <span className={styles.ratingBadge}>
            {"\u2B50"} {tmdbRating.toFixed(1)}
          </span>
        )}
        <div className={styles.hoverInfo}>
          <h3 className={styles.title}>
            {title}
            {year && <span className={styles.year}> ({year})</span>}
          </h3>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
      </div>
    </li>
  );
}

export default Movie;
