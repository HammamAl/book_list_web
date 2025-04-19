import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/bookService.js";
import { getCategories } from "../services/categoryService.js";
import Loading from "../components/common/Loading.js";

const HomePage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    recentBooks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [books, categories] = await Promise.all([getBooks(), getCategories()]);

        setStats({
          totalBooks: books.length,
          totalCategories: categories.length,
          recentBooks: books.slice(0, 3), // Get the 3 most recent books
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <section className="hero is-primary is-bold mb-6">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Welcome to Book List App</h1>
            <h2 className="subtitle">Manage your books and categories in one place</h2>
          </div>
        </div>
      </section>

      <div className="columns">
        <div className="column">
          <div className="box has-text-centered">
            <p className="heading">Total Books</p>
            <p className="title">{stats.totalBooks}</p>
            <Link to="/books" className="button is-primary is-outlined mt-3">
              View All Books
            </Link>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="heading">Total Categories</p>
            <p className="title">{stats.totalCategories}</p>
            <Link to="/categories" className="button is-primary is-outlined mt-3">
              View All Categories
            </Link>
          </div>
        </div>
      </div>

      <h2 className="title is-4 mt-6">Recent Books</h2>
      {stats.recentBooks.length === 0 ? (
        <div className="notification is-info">
          No books added yet. <Link to="/books/new">Add your first book</Link>
        </div>
      ) : (
        <div className="columns">
          {stats.recentBooks.map((book) => (
            <div className="column is-4" key={book.id}>
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title is-size-5">{book.title}</p>
                </header>
                <div className="card-content">
                  <div className="content">
                    <p>
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p>
                      <strong>Publisher:</strong> {book.publisher}
                    </p>
                  </div>
                </div>
                <footer className="card-footer">
                  <Link to={`/books/edit/${book.id}`} className="card-footer-item">
                    View Details
                  </Link>
                </footer>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="buttons is-centered mt-6">
        <Link to="/books/new" className="button is-primary">
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>Add New Book</span>
        </Link>
        <Link to="/categories/new" className="button is-info">
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>Add New Category</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
