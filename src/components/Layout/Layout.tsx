import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import styles from "./Layout.module.css";

export interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showSidebar?: boolean;
}

export default function Layout({
  children,
  showNav = true,
  showSidebar = true,
}: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      {showNav && <NavBar />}
      <div className={styles.content}>
        {showSidebar && <SideBar />}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
