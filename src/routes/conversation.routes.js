import express from "express";
import conversationController from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

// POST /api/conversations
conversationRouter.post('/', conversationController.createConversation);

// GET /api/conversations/:userId
conversationRouter.get('/:userId', conversationController.getUserConversations);

conversationRouter.post('/global', conversationController.createGlobalChat);

export default conversationRouter;
