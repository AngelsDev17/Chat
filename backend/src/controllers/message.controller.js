import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in get users for sidebar controller", error.messsage);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in get messages controller", error.messsage);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    const { id: receiverId } = req.params;
    const userId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: userId,
      receiverId: receiverId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    // TODO: Implemente realtime functionality using socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in send message controller", error.messsage);
    res.status(500).json({ message: "Internal server error" });
  }
};
