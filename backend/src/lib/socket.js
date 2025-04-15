import { Server } from "socket.io";

let io = null;
const userSocketMap = {}; // { userId: socketId }

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://chat-app-1-yoha.onrender.com",
        "http://localhost:5174"
      ],
      credentials: true,
    },
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    // Send online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle new message events
    socket.on("sendMessage", (message) => {
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
      // Also send back to sender's other devices
      const senderSocketId = getReceiverSocketId(message.senderId);
      if (senderSocketId && senderSocketId !== socket.id) {
        io.to(senderSocketId).emit("newMessage", message);
      }
    });

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