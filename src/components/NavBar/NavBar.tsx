import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <>
      <nav className={styles.flexContainer}>
        <h1>MagnetPlay</h1>

        <div className={styles.navButtonsContainer}>
          <ul className={styles.ul}>
            <li className={styles.listItem}>
              <a href="#">Home</a>
            </li>
            <li className={styles.listItem}>
              <a href="#">Docs</a>
            </li>
            <li className={styles.listItem}>
              <a href="#">About</a>
            </li>
            <li className={styles.listItem}>
              <a href="#">.....</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
