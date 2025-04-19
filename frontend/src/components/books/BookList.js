import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookItem from "./BookItem.js";
import Loading from "../common/Loading.js";
import { getBooks } from "../../services/bookService.js";
import { getCategories } from "../../services/categoryService.js";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: "",
    search: "",
    publicationDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, categoriesData] = await Promise.all([getBooks(filters), getCategories()]);
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filters are already applied via the useEffect dependency
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      search: "",
      publicationDate: "",
    });
  };

  return (
    <div className="container">
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

      <div className="box">
        <form onSubmit={handleSearch}>
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="field">
                <label className="label">Search</label>
                <div className="control has-icons-left">
                  <input className="input" type="text" placeholder="Search by title, author or publisher" name="search" value={filters.search} onChange={handleFilterChange} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="column is-3">
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
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

            <div className="column is-3">
              <div className="field">
                <label className="label">Publication Date</label>
                <div className="control">
                  <input className="input " type="date" name="publicationDate" value={filters.publicationDate} onChange={handleFilterChange} />
                </div>
              </div>
            </div>

            <div className="column is-2">
              <div className="field is-grouped" style={{ marginTop: "32px" }}>
                <div className="control">
                  <button type="submit" className="button is-info">
                    Filter
                  </button>
                </div>
                <div className="control">
                  <button type="button" className="button is-light" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

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
