
import dotenv from "dotenv";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import connectMongo from "./config/mongo.js";
import verifyJWT from "./utils/jwt.js";
import chatSocket from "./socket/chat.socket.js";
import conversationRouter from "./routes/conversation.routes.js";
import messageRouter from "./routes/message.routes.js";
import cors from "cors";

const app = express();
dotenv.config();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true                // if using cookies or auth headers
}));

app.use(express.json());

app.use('/api/conversations', conversationRouter);

app.use('/api/messages', messageRouter);

app.use('/', (req, res, next) => {
  res.json({ message: 'hello world' });
});
connectMongo()

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const user = verifyJWT(token);
    socket.user = user;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  chatSocket(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});
