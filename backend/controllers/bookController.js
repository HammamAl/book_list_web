import { Book, Category } from "../models/index.js";
import { Op } from "sequelize";

// CREATE BOOK
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL BOOKS (with optional filters)
export const getBooks = async (req, res) => {
  try {
    const { categoryId, search, publicationDate } = req.query;
    let where = {};

    if (categoryId) where.categoryId = categoryId;
    if (publicationDate) where.publicationDate = publicationDate;
    if (search) {
      where[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { author: { [Op.like]: `%${search}%` } }, { publisher: { [Op.like]: `%${search}%` } }];
    }

    const books = await Book.findAll({
      where,
      include: [{ model: Category, as: "category" }],
      order: [["createdAt", "DESC"]],
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedBook = await Book.findByPk(id);
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: "Buku tidak ditemukan" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: "Buku berhasil dihapus" });
    } else {
      res.status(404).json({ error: "Buku tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
