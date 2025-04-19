import React from "react";
import { Link } from "react-router-dom";
import { deleteBook } from "../../services/bookService.js";

const BookItem = ({ book, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(book.id);
        if (onDelete) onDelete(book.id);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{book.title}</p>
      </header>
      <div className="card-content">
        <div className="content">
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Publisher:</strong> {book.publisher}
          </p>
          <p>
            <strong>Publication Date:</strong> {formatDate(book.publicationDate)}
          </p>
          <p>
            <strong>Pages:</strong> {book.pages}
          </p>
          <p>
            <strong>Category:</strong> {book.category ? book.category.name : "N/A"}
          </p>
          {book.isbn && (
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
          )}
        </div>
      </div>
      <footer className="card-footer">
        <Link to={`/books/edit/${book.id}`} className="card-footer-item">
          <span className="icon">
            <i className="fas fa-edit"></i>
          </span>
          <span>Edit</span>
        </Link>
        <a href="#" className="card-footer-item has-text-danger" onClick={handleDelete}>
          <span className="icon">
            <i className="fas fa-trash"></i>
          </span>
          <span>Delete</span>
        </a>
      </footer>
    </div>
  );
};

export default BookItem;
