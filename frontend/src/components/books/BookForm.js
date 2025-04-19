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
  const [submitting, setSubmitting] = useState(false); // Added missing state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching data, isEditMode:", isEditMode, "id:", id);

        const categoriesData = await getCategories();
        console.log("Categories loaded:", categoriesData);
        setCategories(categoriesData);

        if (isEditMode && id) {
          try {
            console.log("Attempting to fetch book with ID:", id);
            const bookData = await getBookById(id);
            console.log("Book data received:", bookData);

            if (!bookData) {
              throw new Error("Book data is empty or undefined");
            }

            // Format data untuk form
            const formattedBook = {
              title: bookData.title || "",
              author: bookData.author || "",
              publisher: bookData.publisher || "",
              pages: bookData.pages || "",
              categoryId: bookData.categoryId || "",
              isbn: bookData.isbn || "",
              publicationDate: "",
            };

            // Format tanggal jika ada
            if (bookData.publicationDate) {
              const date = new Date(bookData.publicationDate);
              formattedBook.publicationDate = date.toISOString().split("T")[0];
            }

            console.log("Formatted book data for form:", formattedBook);
            setBook(formattedBook);
          } catch (bookError) {
            console.error("Error fetching book:", bookError);
            setNotification({
              message: `Failed to load book: ${bookError.message}`,
              type: "error",
            });
          }
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
  }, [id, isEditMode, setNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: name === "pages" ? parseInt(value) || "" : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Pastikan format data sesuai
      const bookToSubmit = {
        ...book,
        pages: parseInt(book.pages, 10) || 0,
      };

      if (isEditMode) {
        await updateBook(id, bookToSubmit);
        setNotification({
          message: "Buku berhasil diperbarui",
          type: "success",
        });
      } else {
        await createBook(bookToSubmit);
        setNotification({
          message: "Buku berhasil ditambahkan",
          type: "success",
        });
      }

      navigate("/books");
    } catch (error) {
      console.error("Error saving book:", error);

      // Tampilkan pesan error yang lebih informatif
      let errorMessage = "Gagal menyimpan buku";
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.join(", ");
        }
      }

      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
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
              <input className="input has-background-white has-text-black" type="text" name="title" value={book.title} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Author</label>
            <div className="control">
              <input className="input has-background-white has-text-black" type="text" name="author" value={book.author} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Publication Date</label>
            <div className="control">
              <input className="input has-background-white has-text-black" type="date" name="publicationDate" value={book.publicationDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Publisher</label>
            <div className="control">
              <input className="input has-background-white has-text-black" type="text" name="publisher" value={book.publisher} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label className="label">Number of Pages</label>
            <div className="control">
              <input className="input has-background-white has-text-black" type="number" name="pages" value={book.pages} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select className="has-background-white has-text-black" name="categoryId" value={book.categoryId} onChange={handleChange} required>
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
              <input className="input has-background-white has-text-black" type="text" name="isbn" value={book.isbn || ""} onChange={handleChange} placeholder="ISBN-10 or ISBN-13" />
            </div>
            <p className="help">Format: ISBN-10 (e.g., 0-306-40615-2) or ISBN-13 (e.g., 978-3-16-148410-0)</p>
          </div>

          <div className="field is-grouped mt-5">
            <div className="control">
              <button type="submit" className={`button is-primary ${submitting ? "is-loading" : ""}`} disabled={submitting}>
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
            <div className="control">
              <button type="button" className="button is-danger" onClick={() => navigate("/books")}>
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
