import { db } from "../config/firebase.js";

const booksCollection = db.collection("books");

// Validasi ISBN
const validateISBN = (isbn) => {
  if (!isbn) return true;

  const cleanISBN = isbn.replace(/[-\s]/g, "");

  // Validasi ISBN-10
  const isValidISBN10 = () => {
    if (!/^\d{9}[\dX]$/.test(cleanISBN)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanISBN.charAt(i)) * (10 - i);
    }

    const checkDigit = cleanISBN.charAt(9).toUpperCase();
    const remainder = (11 - (sum % 11)) % 11;

    return remainder === 10 ? checkDigit === "X" : parseInt(checkDigit) === remainder;
  };

  // Validasi ISBN-13
  const isValidISBN13 = () => {
    if (!/^(978|979)\d{10}$/.test(cleanISBN)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanISBN.charAt(i)) * (i % 2 === 0 ? 1 : 3);
    }

    const checkDigit = parseInt(cleanISBN.charAt(12));
    const remainder = (10 - (sum % 10)) % 10;

    return checkDigit === remainder;
  };

  if (cleanISBN.length === 10) {
    if (!isValidISBN10()) {
      throw new Error("Format ISBN-10 tidak valid");
    }
  } else if (cleanISBN.length === 13) {
    if (!isValidISBN13()) {
      throw new Error("Format ISBN-13 tidak valid");
    }
  } else {
    throw new Error("Format ISBN tidak valid. Gunakan format ISBN-10 atau ISBN-13");
  }

  return true;
};

// Validasi data buku
const validateBook = (bookData) => {
  const errors = [];

  if (!bookData.title || bookData.title.trim() === "") {
    errors.push("Judul buku tidak boleh kosong");
  }

  if (!bookData.author || bookData.author.trim() === "") {
    errors.push("Nama penulis tidak boleh kosong");
  }

  if (!bookData.publicationDate) {
    errors.push("Tanggal publikasi tidak boleh kosong");
  }

  if (!bookData.publisher || bookData.publisher.trim() === "") {
    errors.push("Nama penerbit tidak boleh kosong");
  }

  if (!bookData.pages || isNaN(bookData.pages) || bookData.pages < 1) {
    errors.push("Jumlah halaman harus berupa angka dan minimal 1");
  }

  if (!bookData.categoryId) {
    errors.push("Kategori buku harus dipilih");
  }

  if (bookData.isbn) {
    try {
      validateISBN(bookData.isbn);
    } catch (error) {
      errors.push(error.message);
    }
  }

  return errors;
};

// Cek ISBN unik
const isIsbnUnique = async (isbn, excludeId = null) => {
  if (!isbn) return true;

  let query = booksCollection.where("isbn", "==", isbn);
  const snapshot = await query.get();

  if (snapshot.empty) return true;

  // Jika ini adalah update, kita perlu mengecualikan dokumen yang sedang diupdate
  if (excludeId) {
    return snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId;
  }

  return false;
};

export { booksCollection, validateBook, isIsbnUnique };
