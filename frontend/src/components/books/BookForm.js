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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (isEditMode && id) {
          try {
            const bookData = await getBookById(id);
            if (!bookData) {
              throw new Error("Book data is empty or undefined");
            }
            const formattedBook = {
              title: bookData.title || "",
              author: bookData.author || "",
              publisher: bookData.publisher || "",
              pages: bookData.pages || "",
              categoryId: bookData.categoryId || "",
              isbn: bookData.isbn || "",
              publicationDate: "",
            };
            if (bookData.publicationDate) {
              const date = new Date(bookData.publicationDate);
              formattedBook.publicationDate = date.toISOString().split("T")[0];
            }
            setBook(formattedBook);
          } catch (bookError) {
            console.error("Error fetching book:", bookError);
            setNotification({
              message: `Failed to load book: ${bookError.message}`,
              type: "error",
            });
          }
        } else {
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
      } catch (error) {
        console.error("Error in fetchData:", error);
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
    setSubmitting(true);
    setErrors([]);

    try {
      const bookToSubmit = {
        ...book,
        pages: parseInt(book.pages, 10) || 0,
        categoryId: book.categoryId || null,
      };

      const validationErrors = [];
      if (!bookToSubmit.title) validationErrors.push("Title is required.");
      if (!bookToSubmit.author) validationErrors.push("Author is required.");
      if (!bookToSubmit.publicationDate) validationErrors.push("Publication Date is required.");
      if (!bookToSubmit.publisher) validationErrors.push("Publisher is required.");
      if (!bookToSubmit.pages || bookToSubmit.pages <= 0) validationErrors.push("Number of Pages must be greater than 0.");
      if (!bookToSubmit.categoryId) validationErrors.push("Category is required.");

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setSubmitting(false);
        return;
      }

      if (isEditMode) {
        await updateBook(id, bookToSubmit);
        setNotification({
          message: "Book updated successfully",
          type: "success",
        });
      } else {
        await createBook(bookToSubmit);
        setNotification({
          message: "Book added successfully",
          type: "success",
        });
      }

      setTimeout(() => navigate("/books"), 1500);
    } catch (error) {
      console.error("Error saving book:", error);
      let errorMessage = "Failed to save book";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((err) => err.msg || err).join(", ");
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setNotification({
        message: errorMessage,
        type: "error",
      });
      setErrors([errorMessage]);
    } finally {
      if (errors.length === 0) {
        setSubmitting(false);
      }
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
      {/* Updated style tag for custom background and placeholder */}
      <style>
        {`
          /* Custom background color for inputs and select */
          .input-custom-bg {
            background-color: #f2f2f2 !important;
            border-color: #dbdbdb; /* Optional: Adjust border color if needed */
          }

          /* Placeholder color for custom background */
          .input-custom-bg.has-text-black::placeholder {
            color: #a0a0a0 !important; /* Keep placeholder visible */
            opacity: 1;
          }
          .input-custom-bg.has-text-black::-webkit-input-placeholder {
            color: #a0a0a0 !important;
          }
          .input-custom-bg.has-text-black::-moz-placeholder {
            color: #a0a0a0 !important;
            opacity: 1;
          }
          .input-custom-bg.has-text-black:-ms-input-placeholder {
            color: #a0a0a0 !important;
          }
          .input-custom-bg.has-text-black:-moz-placeholder {
            color: #a0a0a0 !important;
            opacity: 1;
          }

          /* Style for the date input placeholder */
          .input[type="date"].input-custom-bg.has-text-black:required:invalid::-webkit-datetime-edit {
            color: #a0a0a0;
          }
        `}
      </style>

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
          {/* Title Input */}
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="text" name="title" value={book.title} onChange={handleChange} placeholder="e.g., The Great Gatsby" required />
            </div>
          </div>

          {/* Author Input */}
          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="text" name="author" value={book.author} onChange={handleChange} placeholder="e.g., F. Scott Fitzgerald" required />
            </div>
          </div>

          {/* Publication Date Input */}
          <div className="field">
            <label className="label">Publication Date</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="date" name="publicationDate" value={book.publicationDate} onChange={handleChange} required />
            </div>
          </div>

          {/* Publisher Input */}
          <div className="field">
            <label className="label">Publisher</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="text" name="publisher" value={book.publisher} onChange={handleChange} placeholder="e.g., Charles Scribner's Sons" required />
            </div>
          </div>

          {/* Pages Input */}
          <div className="field">
            <label className="label">Number of Pages</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="number" name="pages" value={book.pages} onChange={handleChange} min="1" placeholder="e.g., 180" required />
            </div>
          </div>

          {/* Category Select */}
          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <div className="select is-fullwidth">
                {/* Removed has-background-white, added input-custom-bg */}
                <select className="input-custom-bg has-text-black" name="categoryId" value={book.categoryId} onChange={handleChange} required style={{ width: "100%", paddingRight: "2.5em" }}>
                  {" "}
                  {/* Added inline style for select width/padding */}
                  <option value="" disabled>
                    -- Select a book category --
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

          {/* ISBN Input */}
          <div className="field">
            <label className="label">ISBN (Optional)</label>
            <div className="control">
              {/* Removed has-background-white, added input-custom-bg */}
              <input className="input input-custom-bg has-text-black" type="text" name="isbn" value={book.isbn || ""} onChange={handleChange} placeholder="Enter 10 or 13 digit ISBN" />
            </div>
            <p className="help">Format: ISBN-10 (e.g., 0-306-40615-2) or ISBN-13 (e.g., 978-3-16-148410-0)</p>
          </div>

          {/* Buttons */}
          <div className="field is-grouped mt-5">
            <div className="control">
              <button type="submit" className={`button is-primary ${submitting ? "is-loading" : ""}`} disabled={submitting}>
                {isEditMode ? "Update Book" : "Save Book"}
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
