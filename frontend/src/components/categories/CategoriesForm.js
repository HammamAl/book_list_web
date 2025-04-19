import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, createCategory, updateCategory } from "../../services/categoryService.js";
import Loading from "../common/Loading.js";
import Notification from "../layout/Notification.js";

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        setLoading(true);
        try {
          const data = await getCategoryById(id);
          setCategory(data);
        } catch (error) {
          console.error("Error fetching category:", error);
          setNotification({
            message: "Failed to load category",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      if (isEditMode) {
        await updateCategory(id, category);
        setNotification({
          message: "Category updated successfully",
          type: "success",
        });
      } else {
        await createCategory(category);
        setNotification({
          message: "Category created successfully",
          type: "success",
        });
        setCategory({
          name: "",
          description: "",
        });
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/categories");
      }, 2000);
    } catch (error) {
      console.error("Error saving category:", error);

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.error) {
          setErrors([error.response.data.error]);
        }
      } else {
        setNotification({
          message: "Failed to save category",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearNotification = () => {
    setNotification({ message: "", type: "" });
  };

  if (loading && isEditMode) {
    return <Loading />;
  }

  return (
    <div className="container">
      <h1 className="title">{isEditMode ? "Edit Category" : "Add New Category"}</h1>

      {notification.message && <Notification message={notification.message} type={notification.type} onClose={clearNotification} />}

      {errors.length > 0 && (
        <div className="notification is-danger">
          <button className="delete" onClick={() => setErrors([])}></button>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input className="input" type="text" name="name" value={category.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Description (Optional)</label>
            <div className="control">
              <textarea className="textarea" name="description" value={category.description || ""} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="field is-grouped mt-5">
            <div className="control">
              <button type="submit" className={`button is-primary ${loading ? "is-loading" : ""}`} disabled={loading}>
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
            <div className="control">
              <button type="button" className="button is-light" onClick={() => navigate("/categories")}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
