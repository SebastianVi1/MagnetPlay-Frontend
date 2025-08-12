import styles from "./Movie.module.css";

interface MovieProps {
  id: number;
  title: string;
  posterUrl: string;
}

function Movie(props: MovieProps) {
  const { title, posterUrl, id } = props;
  return (
    <>
      <li className={styles.card}>
        <div className={styles.imageContainer}></div>
        <img src={posterUrl} alt={title + " image"} />
      </li>
    </>
  );
}

export default Movie;
