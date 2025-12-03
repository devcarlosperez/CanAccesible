const socketIo = require("socket.io");

let io;

function init(server) {
  io = socketIo(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://canaccesible.es', 'https://www.canaccesible.es'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    const jwt = require("jsonwebtoken");
    const { jwtConfig } = require("../config/jwt");
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { conversationId, message, dateMessage } = data;
      const db = require("../models");
      const Conversation = db.conversation;
      const ConversationMessage = db.conversationMessage;

      // Verify conversation exists and user has access
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) return;

      const isAdmin = socket.user.role === 'admin';
      if (conversation.userId !== socket.user.id && !isAdmin) return;

      // Save message
      const newMessage = await ConversationMessage.create({
        conversationId,
        senderId: socket.user.id,
        message,
        dateMessage,
      });

      // Emit to room
      io.to(conversationId).emit('newMessage', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
    });
  });

  return io;
}

function getIo() {
  return io;
}

module.exports = { init, getIo };