import { useEffect, useState } from "react";
import api from "../api";
import CategoryForm from "./CategoryForm";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div>
      <h2 className="title is-4">Categories</h2>
      <CategoryForm
        onSuccess={() => {
          setEditing(null);
          fetchCategories();
        }}
        editing={editing}
        setEditing={setEditing}
      />
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>{c.books?.length || 0}</td>
              <td>
                <button className="button is-small is-info" onClick={() => setEditing(c)}>
                  Edit
                </button>
                <button className="button is-small is-danger" onClick={() => handleDelete(c.id)}>
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

export default CategoryList;
