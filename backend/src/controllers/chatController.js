import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email avatar role")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversationId = [userId, otherUserId].sort().join("_");

    const messages = await Message.find({ conversationId })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversationId });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      read: false,
    });

    res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

// Search messages
export const searchMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { query, conversationId } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchFilter = {
      $or: [{ sender: userId }, { receiver: userId }],
      content: { $regex: query, $options: "i" },
    };

    if (conversationId) {
      searchFilter.conversationId = conversationId;
    }

    const messages = await Message.find(searchFilter)
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error searching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search messages",
      error: error.message,
    });
  }
};

// Get messages for a specific booking
export const getBookingMessages = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { bookingId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // First, verify this user is part of this booking
    const Booking = mongoose.model("Booking");
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is either the customer or the worker for this booking
    const isCustomer = booking.customer.toString() === userId;
    const isWorker = booking.worker && booking.worker.toString() === userId;

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this chat",
      });
    }

    // Get messages for this booking
    const messages = await Message.find({
      conversationId: `booking_${bookingId}`,
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      conversationId: `booking_${bookingId}`,
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: `booking_${bookingId}`,
        receiver: userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        booking: {
          id: booking._id,
          status: booking.status,
          customer: booking.customer,
          worker: booking.worker,
        },
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching booking messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking messages",
      error: error.message,
    });
  }
};

// Send message for a specific booking
export const sendBookingMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Verify booking exists and user is authorized
    const Booking = mongoose.model("Booking");
    const booking = await Booking.findById(bookingId).populate(
      "customer worker"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is either the customer or the worker
    const isCustomer = booking.customer._id.toString() === userId.toString();
    const isWorker =
      booking.worker && booking.worker._id.toString() === userId.toString();

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages for this booking",
      });
    }

    // Chat is only available for accepted bookings
    if (booking.status === "pending" || booking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Chat is only available for accepted bookings",
      });
    }

    // Determine receiver
    const receiver = isCustomer ? booking.worker._id : booking.customer._id;

    // Create the message
    const newMessage = await Message.create({
      conversationId: `booking_${bookingId}`,
      sender: userId,
      receiver: receiver,
      content: message.trim(),
      type: "text",
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    // Emit message via Socket.IO
    const io = req.app.get("socketio");
    if (io) {
      // Send to booking room
      io.to(`booking_${bookingId}`).emit("new_message", {
        message: populatedMessage,
        bookingId: bookingId,
      });

      // Send to specific user rooms
      io.to(`user_${receiver.toString()}`).emit("new_message", {
        message: populatedMessage,
        bookingId: bookingId,
      });
    }

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Error sending booking message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};
