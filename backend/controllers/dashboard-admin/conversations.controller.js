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

exports.getConversations = async (req, res) => {
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

    // Chart Data: Messages per Conversation Type
    // Filter by role (usuario or municipio)
    const roleFilter = req.query.roleFilter || 'usuario';
    
    const conversationChartData = await db.conversationMessage.findAll({
      attributes: [
        [db.sequelize.col('conversation.type'), 'type'],
        [db.sequelize.fn('COUNT', db.sequelize.col('ConversationMessage.id')), 'count']
      ],
      include: [{
        model: db.conversation,
        as: 'conversation',
        attributes: [],
        required: true,
        include: [{
          model: db.user,
          as: 'user',
          attributes: [],
          required: true,
          include: [{ 
              model: db.role,
              as: 'role',
              where: { role: roleFilter } 
          }]
        }]
      }],
      group: ['conversation.type'],
      raw: true
    });

    console.log('Conversations Controller - Chart Data:', JSON.stringify(conversationChartData));

    res.render("admin/dashboard/conversations/index", {
      user: req.user,
      title: "Gestión de Conversaciones - CanAccesible",
      frontendUrl: process.env.FRONTEND_URL,
      conversations: conversationsWithColors,
      jwtToken: jwtToken, // Pass JWT token to the view
      getTypeColor: getTypeColor, // Pass function to template
      conversationChartData,
      roleFilter,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).send("Error fetching conversations");
  }
};

exports.getConversationChat = async (req, res) => {
  try {
    const conversationId = req.params.id;

    if (!req.user && !req.session.userId) {
        return res.status(401).send("No autorizado");
    }

    // Generate temporary JWT token based on admin session
    const jwtToken = jwt.sign(
      {
        id: req.session.userId,
        email: req.session.email,
        role: req.session.role,
      },
      jwtConfig.secret,
      { expiresIn: "24h" }
    );

    const conversation = await db.conversation.findByPk(conversationId, {
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "nameFile"],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).send("Conversación no encontrada");
    }

    res.render("admin/dashboard/conversations/chat", {
      user: req.user,
      title: `Chat con ${conversation.user.firstName} - CanAccesible`,
      frontendUrl: process.env.FRONTEND_URL,
      conversation: conversation,
      jwtToken: jwtToken,
    });
  } catch (error) {
    console.error("Error fetching conversation chat:", error);
    res.status(500).send("Error fetching conversation chat");
  }
};
