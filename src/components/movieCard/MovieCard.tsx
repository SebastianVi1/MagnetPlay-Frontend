import styles from "./Movie.module.css";

interface MovieProps {
  id: number;
  title: string;
  posterUrl: string;
  description?: string;
}

function Movie({ title, posterUrl, description }: MovieProps) {
  return (
    <li className={styles.card} tabIndex={0}>
      <div className={styles.imageContainer}>
        <img src={posterUrl} alt={title + " poster"} loading="lazy" />
        <div className={styles.hoverInfo}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
      </div>
    </li>
  );
}

export default Movie;
