import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BookItem from "./BookItem.js";
import Loading from "../common/Loading.js";
import { getBooks } from "../../services/bookService.js";
import { getCategories } from "../../services/categoryService.js";
import Notification from "../layout/Notification.js";

const BookList = () => {
  const location = useLocation();
  const [notification, setNotification] = useState({ message: "", type: "" });

  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    const categoryIdFromUrl = params.get("categoryId") || "";
    return {
      categoryId: categoryIdFromUrl,
      search: "",
      publicationDate: "",
    };
  };

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(getInitialFilters);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, categoriesData] = await Promise.all([getBooks(filters), getCategories()]);

        const sortedBooks = booksData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Set the *sorted* books and categories to state
        setBooks(sortedBooks);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification({
          message: "Failed to load books",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryIdFromUrl = params.get("categoryId") || "";
    if (categoryIdFromUrl !== filters.categoryId) {
      setFilters((prev) => ({ ...prev, categoryId: categoryIdFromUrl }));
    }
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      search: "",
      publicationDate: "",
    });
  };

  const clearNotification = () => {
    setNotification({ message: "", type: "" });
  };

  // Custom CSS for black placeholder text
  const searchInputStyle = {
    "::placeholder": {
      color: "black",
      opacity: 1,
    },
  };

  return (
    <div className="container">
      {/* Added Title and Add Book Button Section */}
      <div className="columns is-vcentered mb-5">
        <div className="column">
          <h1 className="title">Books</h1>
        </div>
        <div className="column is-narrow">
          <Link to="/books/new" className="button is-primary">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add Book</span>
          </Link>
        </div>
      </div>

      {notification.message && <Notification message={notification.message} type={notification.type} onClose={clearNotification} />}

      <div className="box">
        <form onSubmit={handleSearch}>
          <div className="columns is-multiline">
            {/* Input Search - Modified with white background, black text, and black placeholder */}
            <div className="column is-4">
              <div className="field">
                <label className="label">Search</label>
                <div className="control has-icons-left">
                  <input
                    className="input has-background-white has-text-black"
                    type="text"
                    placeholder="Search by title, author or publisher"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                      "::WebkitInputPlaceholder": { color: "black" },
                      "::placeholder": { color: "black" },
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
              {/* Add a style tag for the placeholder color */}
              <style>
                {`
                  .has-text-black::placeholder {
                    color: black !important;
                    opacity: 1;
                  }
                  .has-text-black::-webkit-input-placeholder {
                    color: black !important;
                  }
                  .has-text-black::-moz-placeholder {
                    color: black !important;
                  }
                  .has-text-black:-ms-input-placeholder {
                    color: black !important;
                  }
                  .has-text-black:-moz-placeholder {
                    color: black !important;
                  }
                `}
              </style>
            </div>

            {/* Select Category - Modified with white background and black text */}
            <div className="column is-3">
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select className="has-background-white has-text-black" name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Publication Date - Already modified with white background and black text */}
            <div className="column is-3">
              <div className="field">
                <label className="label">Publication Date</label>
                <div className="control">
                  <input className="input has-background-white has-text-black" type="date" name="publicationDate" value={filters.publicationDate} onChange={handleFilterChange} />
                </div>
              </div>
            </div>

            {/* Tombol Filter & Clear */}
            <div className="column is-2">
              <div className="field is-grouped" style={{ marginTop: "32px" }}>
                <div className="control">
                  <button type="submit" className="button is-info">
                    Filter
                  </button>
                </div>
                <div className="control">
                  <button type="button" className="button is-warning" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Tampilan Loading atau Daftar Buku */}
      {loading ? (
        <Loading />
      ) : books.length === 0 ? (
        <div className="notification is-info">No books found. Try adjusting your filters or add a new book.</div>
      ) : (
        <div className="columns is-multiline">
          {books.map((book) => (
            <div className="column is-4" key={book.id}>
              <BookItem book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
