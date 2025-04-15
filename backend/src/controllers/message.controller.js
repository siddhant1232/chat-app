// src/controllers/nessage.controllers.js
import User from "../models/user.model.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import fs from "fs/promises";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllmessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getAllmessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { file } = req;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !file) {
      return res.status(400).json({ error: "Message content required" });
    }

    let imageUrl = null;
    if (file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "chat_app",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
        
        // Clean up temp file
        await fs.unlink(file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const messageData = {
      senderId,
      receiverId,
      text: text || "",
      ...(imageUrl && { image: imageUrl }),
    };

    const newMessage = await Message.create(messageData);

    // Real-time update
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Also notify sender's other devices
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId && senderSocketId !== req.socket.id) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Message send error:", error);
    res.status(500).json({ error: error.message || "Failed to send message" });
  }
};