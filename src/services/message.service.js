import axios from "axios";
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
    .limit(20)
    .lean();

    // 2. Extract senderIds
    const senderIds = [...new Set(messages.map(msg => msg.senderId))];

    // 3. Get user details from MainService
    const url=`${process.env.MAIN_SERVICE_URL}/users/getuser-details`;

    const response = await axios.post(url, {
      ids: senderIds,
    });
    const users = response.data;

    // 4. Map userId to user details
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user;
    });

    // 5. Enrich messages with sender details
    const enrichedMessages = messages.map(msg => ({
      ...msg,
      sender: userMap[msg.senderId] || { id: msg.senderId, firstName: "Unknown", lastName: "" }
    }));

    return enrichedMessages.reverse();
};

export default messageService;
