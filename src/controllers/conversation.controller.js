import conversationService from "../services/conversation.service.js";

const conversationController={};

conversationController.createConversation = async (req, res) => {
  try {
    const result = await conversationService.createConversation(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

conversationController.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await conversationService.getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

conversationController.createGlobalChat=async(req,res)=>{
  try {
    
    const conversations = await conversationService.createGloabalConversation(req.body);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

conversationController.adduserInGloablChat=async(req,res)=>{
  try {
   const {userId,orgId}=req.body;
    const conversations = await conversationService.checkAndAddNewUser(userId,orgId);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default conversationController;
