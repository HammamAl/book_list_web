import { booksCollection, validateBook, isIsbnUnique } from "../models/bookModel.js";
import { categoriesCollection } from "../models/categoryModel.js";

// CREATE BOOK
export const createBook = async (req, res) => {
  try {
    const bookData = req.body;

    // Validasi data
    const errors = validateBook(bookData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Cek ISBN unik
    if (bookData.isbn) {
      const isUnique = await isIsbnUnique(bookData.isbn);
      if (!isUnique) {
        return res.status(400).json({ error: "ISBN sudah digunakan" });
      }
    }

    // Cek kategori ada
    const categoryDoc = await categoriesCollection.doc(bookData.categoryId).get();
    if (!categoryDoc.exists) {
      return res.status(400).json({ error: "Kategori tidak ditemukan" });
    }

    // Tambahkan timestamp
    bookData.createdAt = new Date();
    bookData.updatedAt = new Date();

    // Simpan ke Firestore
    const docRef = await booksCollection.add(bookData);
    const newBook = await docRef.get();

    res.status(201).json({
      id: newBook.id,
      ...newBook.data(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL BOOKS (with optional filters)
export const getBooks = async (req, res) => {
  try {
    const { categoryId, search, publicationDate } = req.query;
    let query = booksCollection;

    // Filter berdasarkan kategori
    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }

    // Filter berdasarkan tanggal publikasi
    if (publicationDate) {
      query = query.where("publicationDate", "==", publicationDate);
    }

    // Ambil semua buku yang sesuai filter
    const snapshot = await query.orderBy("createdAt", "desc").get();

    // Ambil data kategori untuk setiap buku
    const books = [];
    for (const doc of snapshot.docs) {
      const bookData = doc.data();
      const categoryDoc = await categoriesCollection.doc(bookData.categoryId).get();

      // Filter berdasarkan pencarian teks (dilakukan di memory karena Firestore tidak mendukung OR query dengan LIKE)
      if (search) {
        const searchLower = search.toLowerCase();
        const titleMatch = bookData.title.toLowerCase().includes(searchLower);
        const authorMatch = bookData.author.toLowerCase().includes(searchLower);
        const publisherMatch = bookData.publisher.toLowerCase().includes(searchLower);

        if (!titleMatch && !authorMatch && !publisherMatch) {
          continue; // Skip jika tidak cocok dengan pencarian
        }
      }

      books.push({
        id: doc.id,
        ...bookData,
        category: categoryDoc.exists ? { id: categoryDoc.id, ...categoryDoc.data() } : null,
      });
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;

    // Cek buku ada
    const bookDoc = await booksCollection.doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({ error: "Buku tidak ditemukan" });
    }

    // Validasi data
    const errors = validateBook(bookData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Cek ISBN unik
    if (bookData.isbn) {
      const isUnique = await isIsbnUnique(bookData.isbn, id);
      if (!isUnique) {
        return res.status(400).json({ error: "ISBN sudah digunakan" });
      }
    }

    // Cek kategori ada
    if (bookData.categoryId) {
      const categoryDoc = await categoriesCollection.doc(bookData.categoryId).get();
      if (!categoryDoc.exists) {
        return res.status(400).json({ error: "Kategori tidak ditemukan" });
      }
    }

    // Update timestamp
    bookData.updatedAt = new Date();

    // Update di Firestore
    await booksCollection.doc(id).update(bookData);

    // Ambil data yang sudah diupdate
    const updatedDoc = await booksCollection.doc(id).get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek buku ada
    const bookDoc = await booksCollection.doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({ error: "Buku tidak ditemukan" });
    }

    // Hapus dari Firestore
    await booksCollection.doc(id).delete();

    res.json({ message: "Buku berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
