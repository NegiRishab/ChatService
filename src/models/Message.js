import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: { type: String, required: true },
    receiverId: String,
    text: { type: String, required: true },
    seenBy: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;
