// src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use Render's port or fallback to 5001
const PORT = process.env.PORT || 5001;

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://chat-app-1-yoha.onrender.com",
      "http://localhost:5174"
    ],
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});