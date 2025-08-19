import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <>
      <nav className={styles.flexContainer}>
        <h1>MagnetPlay</h1>
        <div className={styles.navButtonsContainer}>
          <ul className={styles.ul}>
            <li className={styles.listItem}>
              <Link to="/">Home</Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/docs">Docs</Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/about">About</Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
