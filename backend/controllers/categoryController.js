import { categoriesCollection, validateCategory, isNameUnique } from "../models/categoryModel.js";
import { booksCollection } from "../models/bookModel.js";

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Validasi data
    const errors = validateCategory(categoryData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Cek nama unik
    const isUnique = await isNameUnique(categoryData.name);
    if (!isUnique) {
      return res.status(400).json({ error: "Nama kategori sudah digunakan" });
    }

    // Tambahkan timestamp
    categoryData.createdAt = new Date();
    categoryData.updatedAt = new Date();

    // Simpan ke Firestore
    const docRef = await categoriesCollection.add(categoryData);
    const newCategory = await docRef.get();

    res.status(201).json({
      id: newCategory.id,
      ...newCategory.data(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const snapshot = await categoriesCollection.orderBy("name").get();

    // Ambil semua buku untuk setiap kategori
    const categories = [];
    for (const doc of snapshot.docs) {
      const categoryData = doc.data();

      // Ambil buku-buku dalam kategori ini
      const booksSnapshot = await booksCollection.where("categoryId", "==", doc.id).get();
      const books = booksSnapshot.docs.map((bookDoc) => ({
        id: bookDoc.id,
        ...bookDoc.data(),
      }));

      categories.push({
        id: doc.id,
        ...categoryData,
        books,
      });
    }

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil dokumen kategori
    const categoryDoc = await categoriesCollection.doc(id).get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    const categoryData = categoryDoc.data();

    // Ambil buku dalam kategori ini
    const booksSnapshot = await booksCollection.where("categoryId", "==", id).get();
    const books = booksSnapshot.docs.map((bookDoc) => ({
      id: bookDoc.id,
      ...bookDoc.data(),
    }));

    // Kembalikan kategori dengan buku-bukunya
    res.json({
      id: categoryDoc.id,
      ...categoryData,
      books,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    // Cek kategori ada
    const categoryDoc = await categoriesCollection.doc(id).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    // Validasi data
    const errors = validateCategory(categoryData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Cek nama unik
    if (categoryData.name) {
      const isUnique = await isNameUnique(categoryData.name, id);
      if (!isUnique) {
        return res.status(400).json({ error: "Nama kategori sudah digunakan" });
      }
    }

    // Update timestamp
    categoryData.updatedAt = new Date();

    // Update di Firestore
    await categoriesCollection.doc(id).update(categoryData);

    // Ambil data yang sudah diupdate
    const updatedDoc = await categoriesCollection.doc(id).get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek kategori ada
    const categoryDoc = await categoriesCollection.doc(id).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    // Cek apakah ada buku yang menggunakan kategori ini
    const booksSnapshot = await booksCollection.where("categoryId", "==", id).get();
    if (!booksSnapshot.empty) {
      // Hapus semua buku dalam kategori ini
      const batch = db.batch();
      booksSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Hapus kategori
    await categoriesCollection.doc(id).delete();

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
