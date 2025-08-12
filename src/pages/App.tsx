import NavBar from "../components/NavBar/NavBar";
import "./App.css";
import SideBar from "../components/SideBar/SideBar";
import Catalog from "../components/movies/Catalog";
function App() {
  return (
    <>
      <div className="main-wrapper">
        <NavBar></NavBar>
        <main className="container">
          <SideBar></SideBar>
          <Catalog categoryName="Most Viewed"></Catalog>
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
