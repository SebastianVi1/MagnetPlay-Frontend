import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SideBar.module.css";

function SideBar() {
  const [activeItem, setActiveItem] = useState("home");

  const toggleActive = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <>
      <div className={styles.sideBarContainer}>
        <nav className={styles.nav}>
          <ul>
            <li
              className={`${styles.listItem} ${
                activeItem === "home" ? styles.active : ""
              }`}
              onClick={() => toggleActive("home")}
            >
              <Link to="/" className={styles.link}>
                Home
              </Link>
            </li>
            <li
              className={`${styles.listItem} ${
                activeItem === "favorites" ? styles.active : ""
              }`}
              onClick={() => toggleActive("watchlist")}
            >
              <Link to="/favorites" className={styles.link}>
                Favorites
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default SideBar;
