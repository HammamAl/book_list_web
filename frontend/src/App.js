import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Layout Components
import Navbar from "./components/layout/Navbar.js";
import Footer from "./components/layout/Footer.js";

// Pages
import HomePage from "./pages/HomePage.js";
import BooksPage from "./pages/BooksPage.js";
import CategoriesPage from "./pages/CategoriesPage.js";
import BookFormPage from "./pages/BookFormPage.js";
import CategoryFormPage from "./pages/CategoryFormPage.js";

function App() {
  return (
    <Router>
      <div className="has-navbar-fixed-top">
        <Navbar />
        <main className="section">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/new" element={<BookFormPage />} />
            <Route path="/books/edit/:id" element={<BookFormPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/new" element={<CategoryFormPage />} />
            <Route path="/categories/edit/:id" element={<CategoryFormPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
