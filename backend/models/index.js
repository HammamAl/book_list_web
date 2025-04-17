import sequelize from "../config/database.js";
import { Book } from "./book.js";
import { Category } from "./Category.js";

Category.hasMany(Book, {
  foreignKey: "categoryId",
  as: "books",
  onDelete: "CASCADE",
});

Book.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Koneksi database berhasil.");
    return true;
  } catch (error) {
    console.log("Gagal terhubung ke database:", error);
    return false;
  }
};

export { sequelize, Book, Category, testConnection };
