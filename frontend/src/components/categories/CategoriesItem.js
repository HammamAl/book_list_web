// src/components/categories/CategoryItem.js
import React from "react";
import { Link } from "react-router-dom";
import { deleteCategory } from "../../services/categoryService";

const CategoryItem = ({ category, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This will also delete all books in this category.`)) {
      try {
        await deleteCategory(category.id);
        if (onDelete) onDelete(category.id);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{category.name}</p>
      </header>
      <div className="card-content">
        <div className="content">
          <p>
            <strong>Books:</strong> {category.books ? category.books.length : 0}
          </p>
          {category.description && <p>{category.description}</p>}
        </div>
      </div>
      <footer className="card-footer">
        <Link to={`/categories/edit/${category.id}`} className="card-footer-item">
          <span className="icon">
            <i className="fas fa-edit"></i>
          </span>
          <span>Edit</span>
        </Link>
        <Link to={`/books?categoryId=${category.id}`} className="card-footer-item">
          <span className="icon">
            <i className="fas fa-book"></i>
          </span>
          <span>View Books</span>
        </Link>
        <button className="card-footer-item button has-text-danger" onClick={handleDelete}>
          <span className="icon">
            <i className="fas fa-trash"></i>
          </span>
          <span>Delete</span>
        </button>
      </footer>
    </div>
  );
};

export default CategoryItem;
