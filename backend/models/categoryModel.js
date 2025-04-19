import { db } from "../config/firebase.js";

const categoriesCollection = db.collection("categories");

// Validasi data kategori
const validateCategory = (categoryData) => {
  const errors = [];

  if (!categoryData.name || categoryData.name.trim() === "") {
    errors.push("Nama kategori tidak boleh kosong");
  }

  return errors;
};

// Cek nama kategori unik
const isNameUnique = async (name, excludeId = null) => {
  let query = categoriesCollection.where("name", "==", name);
  const snapshot = await query.get();

  if (snapshot.empty) return true;

  // Jika ini adalah update, kita perlu mengecualikan dokumen yang sedang diupdate
  if (excludeId) {
    return snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId;
  }

  return false;
};

export { categoriesCollection, validateCategory, isNameUnique };
