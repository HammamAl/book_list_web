function FilterBar({ categories, filter, setFilter }) {
  return (
    <div className="field is-grouped">
      <p className="control">
        <input className="input" type="text" placeholder="Search Title, Author, Publisher" value={filter.search || ""} onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))} />
      </p>
      <p className="control">
        <span className="select">
          <select value={filter.categoryId || ""} onChange={(e) => setFilter((f) => ({ ...f, categoryId: e.target.value }))}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </span>
      </p>
      <p className="control">
        <input className="input" type="date" value={filter.publicationDate || ""} onChange={(e) => setFilter((f) => ({ ...f, publicationDate: e.target.value }))} />
      </p>
    </div>
  );
}

export default FilterBar;
