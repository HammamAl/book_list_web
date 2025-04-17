import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar is-primary" role="navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          Book List
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/books">
            Books
          </Link>
          <Link className="navbar-item" to="/categories">
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
