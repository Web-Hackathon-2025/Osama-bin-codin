import express from 'express';
import {
  getConversations,
  getMessages,
  getUnreadCount,
  deleteMessage,
  searchMessages,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations for logged-in user
router.get('/conversations', getConversations);

// Get messages between logged-in user and another user
router.get('/messages/:otherUserId', getMessages);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Search messages
router.get('/search', searchMessages);

// Delete a message
router.delete('/messages/:messageId', deleteMessage);

export default router;
