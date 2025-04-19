import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isActive, setIsActive] = React.useState(false);

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <strong>Book List App</strong>
          </Link>

          <a role="button" className={`navbar-burger ${isActive ? "is-active" : ""}`} aria-label="menu" aria-expanded="false" onClick={() => setIsActive(!isActive)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-start">
            <Link className={`navbar-item ${location.pathname === "/books" ? "is-active" : ""}`} to="/books">
              Books
            </Link>
            <Link className={`navbar-item ${location.pathname === "/categories" ? "is-active" : ""}`} to="/categories">
              Categories
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
