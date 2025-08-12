import "./NavBar.css";

function NavBar() {
  return (
    <>
      <nav className="flex-container">
        <h1>MagnetPlay</h1>

        <div className="nav_buttons-container">
          <ul>
            <li className="list-item">
              <a href="#">Home</a>
            </li>
            <li className="list-item">
              <a href="#">Docs</a>
            </li>
            <li className="list-item">
              <a href="#">About</a>
            </li>
            <li className="list-item">
              <a href="#">.....</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
