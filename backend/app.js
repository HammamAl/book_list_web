import express from "express";
import cors from "cors";
import { sequelize, testConnection } from "./models/index.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const connected = await testConnection();
  if (connected) {
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  }
};

startServer();
