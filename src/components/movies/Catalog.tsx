import { useEffect, useState } from "react";
import Movie from "../movieCard/MovieCard";
import styles from "./Catalog.module.css";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  description: string;
  imageUri: string;
  magnetUri: string;
  categories: Array<string>;
}

function Catalog() {
  const [moviesByCategory, setMoviesByCategory] = useState<
    Record<string, Movie[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/movies/categories")
      .then((response) => {
        setMoviesByCategory(response.data as Record<string, Movie[]>);
        console.log(response.data);
      })
      .catch((thrown) => console.log(thrown))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        {loading && (
          <p style={{ fontSize: 14, opacity: 0.7 }}>Loading categories...</p>
        )}
        {!loading &&
          Object.entries(moviesByCategory).map(([category, movies]) => (
            <section key={category}>
              <h2>{category}</h2>
              <div className={styles.movieContainer}>
                <ul>
                  {movies.map((m) => (
                    <Movie
                      key={m.id}
                      id={m.id}
                      title={m.title}
                      description={m.description}
                      posterUrl={m.imageUri}
                    />
                  ))}
                </ul>
              </div>
            </section>
          ))}
      </div>
    </>
  );
}

export default Catalog;
