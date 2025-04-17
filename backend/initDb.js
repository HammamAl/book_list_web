import { sequelize, testConnection } from "./models/index.js";

const initDatabase = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Tidak dapat melanjutkan inisialisasi database karena koneksi gagal.");
      return;
    }
    await sequelize.sync({ force: true });
    console.log("Database berhasil disinkronkan, Semua tabel telah dibuat.");
  } catch (error) {
    console.log("Gagal menginisialisasi database: ", error);
  } finally {
    await sequelize.close();
    console.log("Koneksi database ditutup");
  }
};

initDatabase();
