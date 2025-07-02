import express from "express";
import messagecontroller from "../controllers/message.controller.js";

const messageRouter = express.Router();

// POST /api/messages
messageRouter.post('/', messagecontroller.sendMessage);

// GET /api/messages/:conversationId
messageRouter.get('/:conversationId', messagecontroller.getMessagesByConversation);

export default messageRouter;
