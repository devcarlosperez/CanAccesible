const pushSubscriptionController = require("../controllers/pushSubscription.controller");

module.exports = (io, socket) => {
  socket.on("joinConversation", (conversationId) => {
    if (!socket.user) return; // Require auth
    const roomId = String(conversationId);
    socket.join(roomId);
  });

  socket.on("sendMessage", async (data) => {
    if (!socket.user) return; // Require auth

    const { conversationId, message, dateMessage } = data;
    const db = require("../models");
    const Conversation = db.conversation;
    const ConversationMessage = db.conversationMessage;

    try {
      // Verify conversation exists and user has access
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) return;

      const isAdmin = socket.user.role === "admin";
      if (conversation.userId !== socket.user.id && !isAdmin) return;

      // Save message
      const newMessage = await ConversationMessage.create({
        conversationId,
        senderId: socket.user.id,
        message,
        dateMessage,
      });

      // Fetch the message with sender info to emit complete data
      const messageWithSender = await ConversationMessage.findByPk(newMessage.id, {
        include: [{
          model: db.user,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'nameFile'],
          include: [{
            model: db.role,
            as: 'role',
            attributes: ['role']
          }]
        }]
      });

      // Emit to room (use string for consistency)
      const roomId = String(conversationId);
      io.to(roomId).emit("newMessage", messageWithSender);

      // Send Push Notification if Admin is replying to User
      const senderId = socket.user.id;
      
      if (senderId !== conversation.userId) {
        // Check if the user is currently in the conversation room
        // roomId is already defined above as String(conversationId)
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        let isUserInRoom = false;
        
        if (roomSockets) {
          for (const socketId of roomSockets) {
            const s = io.sockets.sockets.get(socketId);
            if (s && s.user && s.user.id === conversation.userId) {
              isUserInRoom = true;
              break;
            }
          }
        }

        if (!isUserInRoom) {
          const payload = {
            title: `Nueva respuesta de CanAccesible`,
            body: `Desde el chat de ${conversation.type}: ${message.length > 50 ? message.substring(0, 50) + "..." : message}`,
            url: `/dashboard/chat`,
            data: { conversationId: conversationId }
          };
          pushSubscriptionController.sendNotificationToUser(conversation.userId, payload)
            .catch(err => console.error(`Error sending push notification:`, err));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};
