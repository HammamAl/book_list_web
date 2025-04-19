import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

// Daftar origin yang diizinkan
const allowedOrigins = [
  "http://localhost:3000",
  "https://book-list-web-flame.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin tidak diizinkan"));
    }
  }
}));

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;