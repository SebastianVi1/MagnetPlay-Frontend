import styles from "./SideBar.module.css";

function SideBar() {
  return (
    <>
      <div className={styles.sideBarContainer}>
        <nav className={styles.nav}>
          <ul>
            <li className={styles.listItem}>
              <a href="">Home</a>
            </li>
            <li className={styles.listItem}>
              <a href="">Watch List</a>
            </li>
            <li className={styles.listItem}>
              <a href=""></a>
            </li>
            <li className={styles.listItem}>
              <a href=""></a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default SideBar;
