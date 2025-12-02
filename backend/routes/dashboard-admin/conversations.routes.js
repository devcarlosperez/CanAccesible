module.exports = (router) => {
  const db = require("../../models");
  const jwt = require("jsonwebtoken");
  const { jwtConfig } = require("../../config/jwt");

  // Conversations Management Page for Admins
  router.get("/conversations", async (req, res) => {
    try {
      // Generate temporary JWT token based on admin session
      const jwtToken = jwt.sign(
        {
          id: req.session.userId,
          email: req.session.email,
          role: req.session.role,
        },
        jwtConfig.secret,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Fetch all conversations with user details
      const conversations = await db.conversation.findAll({
        include: [
          {
            model: db.user,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: db.conversationMessage,
            as: "messages",
            attributes: ["id", "message", "dateMessage"],
            order: [["createdAt", "DESC"]],
            limit: 1,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.render("admin/dashboard/conversations/index", {
        user: req.user,
        title: "Gestión de Conversaciones - CanAccesible",
        frontendUrl: process.env.FRONTEND_URL,
        conversations: conversations,
        jwtToken: jwtToken, // Pass JWT token to the view
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).send("Error fetching conversations");
    }
  });
};
