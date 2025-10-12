import { Link, useLocation } from "react-router-dom";
import styles from "./SideBar.module.css";

function SideBar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Home", key: "home" },
    { path: "/favorites", label: "Favorites", key: "favorites" },
    { path: "/search", label: "Search", key: "search" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className={styles.sideBarContainer}>
        <nav className={styles.nav}>
          <ul>
            {menuItems.map(({ path, label, key }) => (
              <li
                key={key}
                className={`${styles.listItem} ${
                  isActive(path) ? styles.active : ""
                }`}
              >
                <Link to={path} className={styles.link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default SideBar;
