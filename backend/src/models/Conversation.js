import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Ensure participants array has exactly 2 users
conversationSchema.index({ participants: 1 });

// Static method to find or create conversation
conversationSchema.statics.findOrCreate = async function (userId1, userId2) {
  const participants = [userId1, userId2].sort();
  
  let conversation = await this.findOne({
    participants: { $all: participants, $size: 2 },
  });

  if (!conversation) {
    conversation = await this.create({
      participants,
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0,
      },
    });
  }

  return conversation;
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
