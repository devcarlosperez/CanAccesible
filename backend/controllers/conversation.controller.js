const db = require("../models");
const { verifyToken } = require("../middlewares/auth.middleware");
const Conversation = db.conversation;

// Create a new conversation
exports.create = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the JWT token

    if (!userId) {
      return res.status(400).json({ message: "userId es obligatorio" });
    }

    const conversation = await Conversation.create({
      userId
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al crear la conversación." });
  }
};

// Retrieve all conversations
exports.findAll = async (req, res) => {
  try {
    const userId = req.user.id;

    // If admin, retrieve all; otherwise, only user's own conversations
    const where = req.user.role === 'admin' ? {} : { userId };

    const conversations = await Conversation.findAll({
      where,
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener conversaciones." });
  }
};

// Retrieve a conversation by ID
exports.findOne = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Verify authorization: owner or admin
    if (conversation.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta conversación." });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener la conversación." });
  }
};

// Update a conversation - conversations cannot be updated
exports.update = async (req, res) => {
  return res.status(400).json({ message: "Las conversaciones no pueden ser actualizadas." });
};

// Delete a conversation
exports.delete = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if conversation exists
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Verify authorization: owner or admin
    if (conversation.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta conversación." });
    }

    // Delete conversation
    await Conversation.destroy({
      where: { id: conversationId }
    });

    res.status(200).json({ 
      message: "Conversación eliminada correctamente.",
      conversationId: conversationId
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al eliminar la conversación." });
  }
};