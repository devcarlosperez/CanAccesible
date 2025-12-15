module.exports = (router) => {
  const conversationsController = require("../../controllers/dashboard-admin/conversations.controller");

  // Conversations Management Page for Admins
  router.get("/conversations", conversationsController.getConversations);

  // Chat Window Page
  router.get("/conversations/:id/chat", conversationsController.getConversationChat);
};

