import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../service/UserService";

function NavBar() {
  const { isAuthenticated } = useAuth();
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };
  return (
    <>
      <nav className={styles.flexContainer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>M</span>
          <Link to="/">
            <span className={styles.logoText}>MagnetPlay</span>
          </Link>
        </div>
        <div className={styles.navButtonsContainer}>
          <ul className={styles.ul}>
            <li className={styles.listItem}>
              <Link to="/docs">Docs</Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/about">About</Link>
            </li>

            {!isAuthenticated() ? (
              <li className={styles.listItem}>
                <Link to="/register">Register</Link>
              </li>
            ) : (
              <></>
            )}
            {!isAuthenticated() ? (
              <li className={styles.listItem}>
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <></>
            )}

            {isAuthenticated() ? (
              <li className={styles.listItem}>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
