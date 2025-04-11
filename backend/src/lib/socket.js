import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Store online users: { userId: socketId }
const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

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

export { io, app, server };
