const pushSubscriptionController = require("../controllers/pushSubscription.controller");

module.exports = (io, socket) => {
  socket.on("joinConversation", (conversationId) => {
    if (!socket.user) return; // Require auth
    socket.join(conversationId);
    console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
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

      // Emit to room
      io.to(conversationId).emit("newMessage", newMessage);

      // Send Push Notification if Admin is replying to User
      const senderId = socket.user.id;
      console.log(`[PUSH] Socket: senderId=${senderId}, conversationOwner=${conversation.userId}`);
      
      if (senderId !== conversation.userId) {
        console.log(`[PUSH] Admin replying! Sending push to user ${conversation.userId}`);
        const payload = {
          title: "Nueva respuesta de soporte",
          body: message.length > 50 ? message.substring(0, 50) + "..." : message,
          url: `/dashboard/chat`,
          data: { conversationId: conversationId }
        };
        pushSubscriptionController.sendNotificationToUser(conversation.userId, payload)
          .then(() => console.log(`[PUSH] Notification sent to user ${conversation.userId}`))
          .catch(err => console.error(`[PUSH] Error:`, err));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};
