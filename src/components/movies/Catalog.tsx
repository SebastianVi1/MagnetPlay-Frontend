import Movie from "../movieCard/MovieCard";
import styles from "./Catalog.module.css";
interface CatalogProps {
  categoryName: string;
}
function Catalog(props: CatalogProps) {
  const { categoryName } = props;

  // Simple demo data for Home rows (replace with real data when available)
  const movies = [
    {
      id: 0,
      title: "Avengers",
      posterUrl:
        "https://dyn1.heritagestatic.com/lf?set=path%5B2%2F9%2F1%2F5%2F5%2F29155469%5D%2Csizedata%5B850x600%5D&call=url%5Bfile%3Aproduct.chain%5D",
    },
    {
      id: 1,
      title: "Sample 01",
      posterUrl: "https://placehold.co/300x450?text=Movie+01",
    },
    {
      id: 2,
      title: "Sample 02",
      posterUrl: "https://placehold.co/300x450?text=Movie+02",
    },
    {
      id: 3,
      title: "Sample 03",
      posterUrl: "https://placehold.co/300x450?text=Movie+03",
    },
    {
      id: 4,
      title: "Sample 04",
      posterUrl: "https://placehold.co/300x450?text=Movie+04",
    },
  ];

  return (
    <>
      <div className={styles.mainContainer}>
        <h2>{categoryName}</h2>
        <div className={styles.movieContainer}>
          <ul>
            {movies.map((m) => (
              <Movie
                key={m.id}
                id={m.id}
                title={m.title}
                posterUrl={m.posterUrl}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Catalog;
