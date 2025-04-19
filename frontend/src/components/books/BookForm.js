import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, createBook, updateBook } from "../../services/bookService.js";
import { getCategories } from "../../services/categoryService.js";
import Loading from "../common/Loading.js";
import Notification from "../layout/Notification.js";

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [book, setBook] = useState({
    title: "",
    author: "",
    publicationDate: "",
    publisher: "",
    pages: "",
    categoryId: "",
    isbn: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (isEditMode) {
          const bookData = await getBookById(id);
          // Format date for input field
          if (bookData.publicationDate) {
            const date = new Date(bookData.publicationDate);
            bookData.publicationDate = date.toISOString().split("T")[0];
          }
          setBook(bookData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification({
          message: "Failed to load data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: name === "pages" ? parseInt(value) || "" : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      if (isEditMode) {
        await updateBook(id, book);
        setNotification({
          message: "Book updated successfully",
          type: "success",
        });
      } else {
        await createBook(book);
        setNotification({
          message: "Book created successfully",
          type: "success",
        });
        setBook({
          title: "",
          author: "",
          publicationDate: "",
          publisher: "",
          pages: "",
          categoryId: "",
          isbn: "",
        });
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/books");
      }, 2000);
    } catch (error) {
      console.error("Error saving book:", error);

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.error) {
          setErrors([error.response.data.error]);
        }
      } else {
        setNotification({
          message: "Failed to save book",
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
      <h1 className="title">{isEditMode ? "Edit Book" : "Add New Book"}</h1>

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
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text" name="title" value={book.title} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input className="input" type="text" name="author" value={book.author} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Publication Date</label>
            <div className="control">
              <input className="input" type="date" name="publicationDate" value={book.publicationDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Publisher</label>
            <div className="control">
              <input className="input" type="text" name="publisher" value={book.publisher} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Number of Pages</label>
            <div className="control">
              <input className="input" type="number" name="pages" value={book.pages} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="categoryId" value={book.categoryId} onChange={handleChange} required>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">ISBN (Optional)</label>
            <div className="control">
              <input className="input" type="text" name="isbn" value={book.isbn || ""} onChange={handleChange} placeholder="ISBN-10 or ISBN-13" />
            </div>
            <p className="help">Format: ISBN-10 (e.g., 0-306-40615-2) or ISBN-13 (e.g., 978-3-16-148410-0)</p>
          </div>

          <div className="field is-grouped mt-5">
            <div className="control">
              <button type="submit" className={`button is-primary ${loading ? "is-loading" : ""}`} disabled={loading}>
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
            <div className="control">
              <button type="button" className="button is-light" onClick={() => navigate("/books")}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
