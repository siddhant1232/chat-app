// src/lib/socket.js
import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://chat-app-1-flame.vercel.app",
        "http://localhost:5173" // For local development
      ],
      credentials: true,
    },
  });

  const userSocketMap = {};

  const getReceiverSocketId = (userId) => userSocketMap[userId];

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", socket.id, "as", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return { io, getReceiverSocketId };
};