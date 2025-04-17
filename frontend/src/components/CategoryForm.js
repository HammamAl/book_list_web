import { useState, useEffect } from "react";
import api from "../api";

function CategoryForm({ onSuccess, editing, setEditing }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) setForm({ name: editing.name, description: editing.description || "" });
    else setForm({ name: "", description: "" });
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/categories/${editing.id}`, form);
      } else {
        await api.post("/categories", form);
      }
      setError("");
      onSuccess();
      setForm({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box mb-4">
      <h3 className="title is-5">{editing ? "Edit Category" : "Add Category"}</h3>
      {error && <p className="has-text-danger">{error}</p>}
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
      </div>
      <div className="field">
        <label className="label">Description (optional)</label>
        <div className="control">
          <input className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
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

export default CategoryForm;
