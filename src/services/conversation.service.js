import axios from "axios";
import Conversation from "../models/Conversation.js";

const conversationService = {};

conversationService.createConversation = async (data) => {
  const { participantIds, orgId, isGroup = false, name = null } = data;

  // Check if conversation already exists (non-group)
  if (!isGroup && participantIds.length === 2) {
    const existing = await Conversation.findOne({
      participants: { $all: participantIds, $size: 2 },
      isGroup: false,
    });

    if (existing) return { message: "conversation with user already exist" }
  }

  const conversation = await Conversation.create({
    participants: participantIds,
    isGroup,
    name,
    orgId,
  });

  return conversation;
}

conversationService.getUserConversations = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate('lastMessage')
    .sort({ updatedAt: -1 })
    .lean();

  // Extract sender IDs (other participants)
  const senderIds = [...new Set(
    conversations
      .filter(conv => !conv.isGroup) // only non-group chats
      .flatMap(conv => conv.participants.filter(participant => participant !== userId))
  )];

  // Call MainService to get user details
  const url = `${process.env.MAIN_SERVICE_URL}/users/getuser-details`;

  const response = await axios.post(url, { ids: senderIds });
  const users = response.data;

  // Create a map of userId -> user details
  const userMap = {};
  users.forEach(user => {
    userMap[user.id] = user;
  });

  // Enrich conversations with user details
  const enrichedConversations = conversations.map(conv => {
    if (conv.isGroup) {
      return conv; // group chat, no enrichment needed
    }

    const otherParticipantId = conv.participants.find(participant => participant !== userId);
    return {
      ...conv,
      user: userMap[otherParticipantId] || { id: otherParticipantId, first_name: "Unknown", last_name: "" },
    };
  });

  return enrichedConversations;
};


conversationService.findOneAndUpdate = async (conversationId, updateOption) => {
  return await Conversation.findOneAndUpdate(
    { _id: conversationId },
    updateOption,
    { new: true }
  );
};
conversationService.createGloabalConversation = async (data) => {

  const { participantIds, orgId } = data;
  const globalConversation = await Conversation.create({
    participants: participantIds,
    isGroup: true,
    name: "Global Chat",
    isGlobal: true,
    orgId,
  });

  return globalConversation;

};

conversationService.checkAndAddNewUser = async ( id, orgId) => {
  try {
    const conversation = await Conversation.findOne({ orgId: orgId, isGroup: true });
    if (!conversation) {
      return { message: "Global conversation not created yet" };
    }

    await Conversation.findOneAndUpdate(
      { orgId: orgId, isGroup: true },
      { $addToSet: { participants: id } }
    );

    return { message: "User added successfully" };
  } catch (error) {
    console.error("Error adding user to global chat:", error);
    throw new Error("Could not add user to conversation");
  }
};

export default conversationService;
