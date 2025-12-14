const pushSubscriptionController = require("../controllers/pushSubscription.controller");

module.exports = (io, socket) => {
  socket.on("joinConversation", (conversationId) => {
    if (!socket.user) return; // Require auth
    const roomId = String(conversationId);
    socket.join(roomId);
    console.log(`User ${socket.user.id} joined conversation room: ${roomId}`);
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

      // Emit to room (use string for consistency)
      const roomId = String(conversationId);
      io.to(roomId).emit("newMessage", newMessage);

      // Send Push Notification if Admin is replying to User
      const senderId = socket.user.id;
      console.log(`[PUSH] Socket: senderId=${senderId}, conversationOwner=${conversation.userId}`);
      
      if (senderId !== conversation.userId) {
        // Check if the user is currently in the conversation room
        // roomId is already defined above as String(conversationId)
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        let isUserInRoom = false;
        
        console.log(`[PUSH] Checking room: ${roomId}, Room exists: ${!!roomSockets}, Sockets in room: ${roomSockets ? roomSockets.size : 0}`);
        
        if (roomSockets) {
          for (const socketId of roomSockets) {
            const s = io.sockets.sockets.get(socketId);
            console.log(`[PUSH] Socket in room: ${socketId}, user: ${s?.user?.id}, looking for: ${conversation.userId}`);
            if (s && s.user && s.user.id === conversation.userId) {
              isUserInRoom = true;
              break;
            }
          }
        }

        if (isUserInRoom) {
          console.log(`[PUSH] User ${conversation.userId} is in the room. Skipping notification.`);
        } else {
          console.log(`[PUSH] Admin replying! Sending push to user ${conversation.userId}`);
          const payload = {
            title: `Nueva respuesta de CanAccesible`,
            body: `Desde el chat de ${conversation.type}: ${message.length > 50 ? message.substring(0, 50) + "..." : message}`,
            url: `/dashboard/chat`,
            data: { conversationId: conversationId }
          };
          pushSubscriptionController.sendNotificationToUser(conversation.userId, payload)
            .then(() => console.log(`[PUSH] Notification sent to user ${conversation.userId}`))
            .catch(err => console.error(`[PUSH] Error:`, err));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};
