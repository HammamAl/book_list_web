import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryItem from "./CategoriesItem.js";
import Loading from "../common/Loading.js";
import { getCategories } from "../../services/categoryService.js";
import Notification from "../layout/Notification.js";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setNotification({
        message: "Failed to load categories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setCategories(categories.filter((category) => category.id !== deletedId));
    setNotification({
      message: "Category deleted successfully",
      type: "success",
    });
  };

  const clearNotification = () => {
    setNotification({ message: "", type: "" });
  };

  return (
    <div className="container">
      <div className="columns is-vcentered mb-5">
        <div className="column">
          <h1 className="title">Categories</h1>
        </div>
        <div className="column is-narrow">
          <Link to="/categories/new" className="button is-primary">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {notification.message && <Notification message={notification.message} type={notification.type} onClose={clearNotification} />}

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <div className="notification is-info">No categories found. Add a new category to get started.</div>
      ) : (
        <div className="columns is-multiline">
          {categories.map((category) => (
            <div className="column is-4" key={category.id}>
              <CategoryItem category={category} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
