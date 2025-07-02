import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { redisPub } from '../config/redis.js';

export default function chatSocket(io, socket) {
  const userId = socket.user.id;
  console.log(`🔌 User connected: ${userId}`);

  // Personal room (optional, for notifications)
  socket.join(userId);

  // Join a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Handle message sending
  socket.on('sendMessage', async ({ conversationId, text ,senderId}) => {
    const newMsg = await Message.create({
      conversationId,
      senderId: senderId,
      text,
    });

    // Update lastMessage in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMsg._id,
      updatedAt: new Date(),
    });

    // Emit to all members in the room
    io.to(conversationId).emit('newMessage', newMsg);

    // Redis Pub/Sub for scaling
    // redisPub.publish('chat.message.sent', JSON.stringify(newMsg));
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${userId}`);
  });
}
