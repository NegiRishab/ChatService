import messageService from "../services/message.service.js";

const messagecontroller={};

messagecontroller.sendMessage = async (req, res) => {
  try {
   
    const result = await messageService.sendMessage(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

messagecontroller.getMessagesByConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await messageService.getMessagesByConversation(conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default messagecontroller;