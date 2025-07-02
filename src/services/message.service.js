import Message from "../models/Message.js";
import conversationService from "./conversation.service.js";


const messageService={};
messageService.sendMessage = async (data) => {
  const { conversationId } = data;

  // Create and save the message
  const newMessage = new Message(data);
  await newMessage.save();

  // Update the conversation's lastMessage and updatedAt
  await conversationService.findOneAndUpdate(
    conversationId,
    {
      lastMessage: newMessage._id,
      updatedAt: new Date()
    }
  );

  return {
    message: "Message created successfully",
  };
};


messageService.getMessagesByConversation = async (conversationId) => {
   const messages = await Message.find({ conversationId: conversationId })
    .sort({ createdAt: -1 }) // reverse for infinite scroll
    .limit(20);
    return messages.reverse();
};

export default messageService;
