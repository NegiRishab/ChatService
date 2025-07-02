import Conversation from "../models/Conversation.js";

const conversationService={};

conversationService.createConversation = async (data) => {
  const { participantIds, orgId, isGroup = false, name = null } = data;

  // Check if conversation already exists (non-group)
  if (!isGroup && participantIds.length === 2) {
    const existing = await Conversation.findOne({
      participants: { $all: participantIds, $size: 2 },
      isGroup: false,
    });

    if (existing) return {message:"conversation with user already exist"}
  }

  const conversation = await Conversation.create({
    participants: participantIds,
    isGroup,
    name,
    orgId,
  });

 return  conversation;
}

conversationService.getUserConversations = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    return conversations;
};

conversationService.findOneAndUpdate = async (conversationId, updateOption) => {
  return await Conversation.findOneAndUpdate(
    { _id: conversationId },
    updateOption,
    { new: true }
  );
};
conversationService.createGloabalConversation =  async (data) => {

  const{participantIds,orgId}=data;
  const globalConversation=await Conversation.create({
    participants: participantIds,
    isGroup: true,
    name: "Global Chat",
    isGlobal: true,
    orgId,
  });

  return  globalConversation;

};
export default conversationService;
