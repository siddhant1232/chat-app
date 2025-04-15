// src/lib/socket.js
import { Server } from "socket.io";

let io = null;
const userSocketMap = {}; // { userId: socketId }

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://chat-app-1-yoha.onrender.com",
        "http://localhost:5173"
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    // Send online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};