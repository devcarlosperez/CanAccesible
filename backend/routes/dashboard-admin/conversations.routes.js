module.exports = (router) => {
  const db = require("../../models");
  const jwt = require("jsonwebtoken");
  const { jwtConfig } = require("../../config/jwt");

  // Helper function to get color for conversation type
  const getTypeColor = (type) => {
    const colors = {
      'soporte de cuenta': '#004aad',
      'reportar una incidencia': '#dc2626',
      'recursos de accesibilidad': '#16a34a',
      'consulta general': '#f59e0b'
    };
    return colors[type] || '#004aad';
  };

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
        { expiresIn: "24h" } // Token expires in 24 hour
      );

      // Fetch all conversations with user details
      const conversations = await db.conversation.findAll({
        include: [
          {
            model: db.user,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email", "nameFile"],
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

      // Add color property to each conversation
      const conversationsWithColors = conversations.map(conv => {
        return {
          ...conv.toJSON(),
          typeColor: getTypeColor(conv.type),
          typeColorLight: getTypeColor(conv.type) + '20'
        };
      });

      res.render("admin/dashboard/conversations/index", {
        user: req.user,
        title: "Gestión de Conversaciones - CanAccesible",
        frontendUrl: process.env.FRONTEND_URL,
        conversations: conversationsWithColors,
        jwtToken: jwtToken, // Pass JWT token to the view
        getTypeColor: getTypeColor, // Pass function to template
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).send("Error fetching conversations");
    }
  });
};
