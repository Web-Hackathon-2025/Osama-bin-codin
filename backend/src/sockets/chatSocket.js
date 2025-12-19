import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Store active users and their socket IDs
const activeUsers = new Map();

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User connected: ${userId}`);

    // Store user's socket ID
    activeUsers.set(userId, socket.id);

    // Emit online status to all users
    socket.broadcast.emit('user:online', { userId });

    // Join user to their personal room
    socket.join(userId);

    // Handle sending a message
    socket.on('message:send', async (data, callback) => {
      try {
        const { receiverId, content, type = 'text', fileUrl } = data;

        if (!receiverId || !content) {
          return callback({ 
            success: false, 
            error: 'Receiver ID and content are required' 
          });
        }

        // Find or create conversation
        const conversation = await Conversation.findOrCreate(userId, receiverId);
        const conversationId = `${[userId, receiverId].sort().join('_')}`;

        // Create message
        const message = await Message.create({
          conversationId,
          sender: userId,
          receiver: receiverId,
          content,
          type,
          fileUrl,
        });

        // Populate sender info
        await message.populate('sender', 'name email avatar');

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        
        // Increment unread count for receiver
        const unreadCount = conversation.unreadCount.get(receiverId) || 0;
        conversation.unreadCount.set(receiverId, unreadCount + 1);
        
        await conversation.save();

        // Emit message to receiver if online
        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:receive', {
            message,
            conversationId,
          });
        }

        // Send confirmation to sender
        callback({ 
          success: true, 
          message,
          conversationId,
        });

      } catch (error) {
        console.error('Error sending message:', error);
        callback({ 
          success: false, 
          error: error.message 
        });
      }
    });

    // Handle marking messages as read
    socket.on('message:read', async (data, callback) => {
      try {
        const { messageIds, conversationId } = data;

        if (!messageIds || !Array.isArray(messageIds)) {
          return callback({ 
            success: false, 
            error: 'Message IDs array is required' 
          });
        }

        // Update messages as read
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            receiver: userId,
            read: false,
          },
          {
            $set: {
              read: true,
              readAt: new Date(),
            },
          }
        );

        // Update conversation unread count
        if (conversationId) {
          const conversation = await Conversation.findOne({
            participants: userId,
          }).where('_id').equals(conversationId);

          if (conversation) {
            conversation.unreadCount.set(userId, 0);
            await conversation.save();
          }
        }

        callback({ success: true });

        // Notify sender that messages were read
        const senderId = conversationId?.split('_').find(id => id !== userId);
        if (senderId) {
          const senderSocketId = activeUsers.get(senderId);
          if (senderSocketId) {
            io.to(senderSocketId).emit('message:read', { 
              messageIds,
              readBy: userId,
            });
          }
        }

      } catch (error) {
        console.error('Error marking messages as read:', error);
        callback({ 
          success: false, 
          error: error.message 
        });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:start', {
          userId,
          userName: socket.user.name,
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:stop', {
          userId,
        });
      }
    });

    // Handle getting online users
    socket.on('users:getOnline', (callback) => {
      const onlineUserIds = Array.from(activeUsers.keys());
      callback({ 
        success: true, 
        onlineUsers: onlineUserIds 
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      activeUsers.delete(userId);
      
      // Emit offline status to all users
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  return io;
};

// Export function to get active users (useful for REST API)
export const getActiveUsers = () => {
  return Array.from(activeUsers.keys());
};
