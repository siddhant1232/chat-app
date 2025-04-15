// server.js (replace your current setup)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://chat-app-1-flame.vercel.app",
      "http://localhost:5173" // for local development
    ],
    credentials: true,
  })
);

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});