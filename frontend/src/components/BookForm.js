import { useState, useEffect } from "react";
import api from "../api";
import "./DatePickerStyles.css";

function BookForm({ categories, onSuccess, editing, setEditing }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    publicationDate: "",
    publisher: "",
    pages: "",
    categoryId: "",
    isbn: "",
    coverImage: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) setForm({ ...editing, categoryId: editing.categoryId || "" });
    else setForm({ title: "", author: "", publicationDate: "", publisher: "", pages: "", categoryId: "", isbn: "", coverImage: "" });
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.isbn) delete data.isbn;
      if (!data.coverImage) delete data.coverImage;
      if (editing) {
        await api.patch(`/books/${editing.id}`, data);
      } else {
        await api.post("/books", data);
      }
      setError("");
      onSuccess();
      setForm({ title: "", author: "", publicationDate: "", publisher: "", pages: "", categoryId: "", isbn: "", coverImage: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box mb-4">
      <h3 className="title is-5">{editing ? "Edit Book" : "Add Book"}</h3>
      {error && <p className="has-text-danger">{error}</p>}
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Masukan judul buku..." />
        </div>
      </div>
      <div className="field">
        <label className="label">Author</label>
        <div className="control">
          <input className="input" required value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Masukan nama penulis buku..." />
        </div>
      </div>
      <div className="field">
        <label className="label">Publisher</label>
        <div className="control">
          <input className="input" required value={form.publisher} onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))} placeholder="Masukan nama penerbit..." />
        </div>
      </div>
      <div className="field">
        <label className="label">Publication Date</label>
        <div className="control">
          <input className="input custom-date-input" type="date" required value={form.publicationDate} onChange={(e) => setForm((f) => ({ ...f, publicationDate: e.target.value }))} placeholder="Kapan dipublikasikan..." />
        </div>
      </div>
      <div className="field">
        <label className="label">Pages</label>
        <div className="control">
          <input className="input" type="number" min="1" required value={form.pages} onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value }))} placeholder="Jumlah halaman?" />
        </div>
      </div>
      <div className="field">
        <label className="label">Category</label>
        <div className="control">
          <div className="select">
            <select required value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Select a genre or category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">ISBN (optional)</label>
        <div className="control">
          <input className="input" value={form.isbn || ""} onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))} placeholder="Contoh: 978-3-16-148410-0" />
        </div>
      </div>
      <div className="field">
        <label className="label">Cover Image URL (optional)</label>
        <div className="control">
          <input className="input" value={form.coverImage || ""} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="Contoh: https://www.example.com/example.png" />
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" type="submit">
            {editing ? "Update" : "Add"}
          </button>
        </div>
        {editing && (
          <div className="control">
            <button className="button" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default BookForm;
