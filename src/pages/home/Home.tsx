import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import Movie from "../../components/movieCard/MovieCard";
import { Link } from "react-router-dom";

// Define the shape of a Movie object returned by the API
interface Movie {
  id: number;
  name: string;
  description: string;
  date: string;
  screenshot: Array<string>;
  category: string;
  posterUri: string;
  magnetUri: string;
  hash: string;
}

function Home() {
  // State to hold movies grouped by category (keyed by category name)
  const [moviesByCategory, setMoviesByCategory] = useState<
    Record<string, Movie[]>
  >({});
  // Loading flag while fetching data
  const [loading, setLoading] = useState(true);

  const categoriesList: Array<string> = ["Recent", "Trending", "All"];
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoriesList[0]
  );

  useEffect(() => {
    // Fetch movies organized by categories from backend
    axios
      .get("/api/movies/categories")
      .then((res) => {
        setMoviesByCategory(res.data);
      })
      .catch((error) => {
        console.error("Error fetching movies by category:", error);
      })
      .finally(() => {
        // Clear loading state whether request succeeded or failed
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.mainContainer}>
      {/* Show a loading indicator while data is being fetched */}
      {loading && <p style={{ fontSize: 14, opacity: 0.7 }}>Loading…</p>}

      {/* Category navigation bar */}
      <nav className={styles.categoryContainer}>
        <ul className={styles.categoryNav}>
          {categoriesList.map((e: string) => (
            <li
              key={e}
              className={`${styles.categoryList} ${
                selectedCategory === e ? styles.selected : ""
              }`}
              onClick={() => setSelectedCategory(e)}
            >
              {e}
            </li>
          ))}
        </ul>
      </nav>

      {/* Once loaded, iterate over each category and render its movies */}
      {!loading &&
        Object.entries(moviesByCategory).map(([category, movies]) => (
          <section key={category}>
            {/* Category header */}
            <div className={styles.movieContainer}>
              <ul>
                {/* Render each movie in this category as a MovieCard */}

                {movies.map((m) => (
                  <Link to={`movie/${m.id}`}>
                    <Movie
                      key={m.id}
                      id={m.id}
                      title={m.name}
                      description={m.description}
                      posterUrl={m.posterUri}
                    />
                  </Link>
                ))}
              </ul>
            </div>
          </section>
        ))}
    </div>
  );
}
export default Home;
