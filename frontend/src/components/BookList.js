import { useEffect, useState } from "react";
import api from "../api";
import FilterBar from "./FilterBar";
import BookForm from "./BookForm";

function BookList() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({});
  const [editing, setEditing] = useState(null);

  const fetchBooks = async () => {
    const params = {};
    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.search) params.search = filter.search;
    if (filter.publicationDate) params.publicationDate = filter.publicationDate;
    const res = await api.get("/books", { params });
    setBooks(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchBooks();
  }, [filter]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book?")) {
      await api.delete(`/books/${id}`);
      fetchBooks();
    }
  };

  return (
    <div>
      <h2 className="title is-4">Books</h2>
      <BookForm
        categories={categories}
        onSuccess={() => {
          setEditing(null);
          fetchBooks();
        }}
        editing={editing}
        setEditing={setEditing}
      />
      <FilterBar categories={categories} filter={filter} setFilter={setFilter} />
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Publication Date</th>
            <th>Pages</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.publicationDate}</td>
              <td>{b.pages}</td>
              <td>{b.category?.name}</td>
              <td>
                <button className="button is-small is-info" onClick={() => setEditing(b)}>
                  Edit
                </button>
                <button className="button is-small is-danger" onClick={() => handleDelete(b.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
