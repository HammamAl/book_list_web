import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Judul buku tidak boleh kosong",
        },
      },
    },
    author: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama penulis tidak boleh kosong",
        },
      },
    },
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Format tanggal publikasi tidak valid",
        },
        notEmpty: {
          msg: "Tanggal publikasi tidak boleh kosong",
        },
      },
    },
    publisher: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama penerbit tidak boleh kosong",
        },
      },
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Jumlah halaman harus berupa angka",
        },
        min: {
          args: [1],
          msg: "Jumlah halaman minimal 1",
        },
      },
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        isISBN(value) {
          if (!value) return;

          // Hapus semua tanda pisah dan spasi
          const cleanISBN = value.replace(/[-\s]/g, "");

          // Validasi ISBN-10
          const isValidISBN10 = () => {
            // Cek format ISBN-10
            if (!/^\d{9}[\dX]$/.test(cleanISBN)) {
              return false;
            }

            // Hitung checksum
            let sum = 0;
            for (let i = 0; i < 9; i++) {
              sum += parseInt(cleanISBN.charAt(i)) * (10 - i);
            }

            // Verifikasi digit terakhir
            const checkDigit = cleanISBN.charAt(9).toUpperCase();
            const remainder = (11 - (sum % 11)) % 11;

            return remainder === 10 ? checkDigit === "X" : parseInt(checkDigit) === remainder;
          };

          // Validasi ISBN-13
          const isValidISBN13 = () => {
            // Cek format ISBN-13
            if (!/^(978|979)\d{10}$/.test(cleanISBN)) {
              return false;
            }

            // Hitung checksum
            let sum = 0;
            for (let i = 0; i < 12; i++) {
              sum += parseInt(cleanISBN.charAt(i)) * (i % 2 === 0 ? 1 : 3);
            }

            // Verifikasi digit terakhir
            const checkDigit = parseInt(cleanISBN.charAt(12));
            const remainder = (10 - (sum % 10)) % 10;

            return checkDigit === remainder;
          };

          // Validasi berdasarkan panjang ISBN setelah pembersihan
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
        },
      },
    },
    coverImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      validate: {
        notNull: {
          msg: "Kategori buku harus dipilih",
        },
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
    indexes: [
      {
        fields: ["title"],
      },
      {
        fields: ["author"],
      },
      {
        fields: ["publicationDate"],
      },
      {
        fields: ["categoryId"],
      },
      {
        unique: true,
        fields: ["isbn"],
      },
    ],
  }
);

export { Book };
