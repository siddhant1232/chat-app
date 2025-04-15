// src/controllers/nessage.controllers.js
import User from "../models/user.model.js";
import Message from "../models/message.models.js";
import { getIO } from '../lib/socket.js'; // Verify correct path
import { getReceiverSocketId } from "../lib/socket.js";


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
    const text = req.body.text;
    const file = req.file;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if ((!text || text.trim() === "") && !file) {
      return res.status(400).json({ error: "Message content required" });
    }

    let imageUrl = null;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "chat_app"
        });
        imageUrl = result.secure_url;
        await fs.unlink(file.path); // Clean up temp file
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const messageData = {
      senderId,
      receiverId,
      text: text?.trim() || null,
      ...(imageUrl && { image: imageUrl }),
    };

    const newMessage = await Message.create(messageData);

    // Socket.io integration
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Message error:", error);
    res.status(500).json({ error: error.message });
  }
};