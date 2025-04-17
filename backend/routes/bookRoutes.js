import express from "express";
import { createBook, getBooks, updateBook, deleteBook } from "../controllers/bookController.js";

const router = express.Router();

// Route untuk membuat buku baru
router.post("/", createBook);

// Route untuk mendapatkan daftar buku (dengan filter opsional)
router.get("/", getBooks);

// Route untuk memperbarui buku berdasarkan ID
router.patch("/:id", updateBook);

// Route untuk menghapus buku berdasarkan ID
router.delete("/:id", deleteBook);

export default router;
