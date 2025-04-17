import { Category, Book } from "../models/index.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Book, as: "books" }],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id } });

    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: "Kategori tidak ditemukan" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: "Kategori berhasil dihapus" });
    } else {
      res.status(404).json({ error: "Kategori tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
