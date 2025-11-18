const db = require("../models");
const { verifyToken } = require("../middlewares/auth.middleware");
const ConversationMessage = db.conversationMessage;
const Conversation = db.conversation;

// Create a new conversation message
exports.create = async (req, res) => {
  try {
    const senderId = req.user.id; // Extracted from JWT token
    const { message, dateMessage } = req.body;
    const conversationId = req.params.conversationId;

    if (!conversationId || !message || !dateMessage) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verify that the conversation exists and user has access
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Check if user is owner of conversation or admin
    const isAdmin = req.user.role === 'admin';
    if (conversation.userId !== senderId && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para enviar mensajes en esta conversación." });
    }

    const conversationMessage = await ConversationMessage.create({
      conversationId,
      senderId,
      message,
      dateMessage,
    });

    res.status(201).json(conversationMessage);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al crear el mensaje de conversación." });
  }
};

// Retrieve all messages of a conversation
exports.findAll = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Verify conversation exists
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Check if user is owner of conversation or admin
    if (conversation.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para ver los mensajes de esta conversación." });
    }

    // Get all messages of this conversation
    const messages = await ConversationMessage.findAll({
      where: { conversationId }
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener los mensajes de la conversación." });
  }
};

// Retrieve a specific message
exports.findOne = async (req, res) => {
  try {
    const messageId = req.params.id;
    const conversationId = req.params.conversationId;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Verify conversation exists
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Find the message
    const message = await ConversationMessage.findOne({
      where: { id: messageId, conversationId }
    });

    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado." });
    }

    // Check if user can view: is owner of conversation, admin, or author of message
    if (conversation.userId !== userId && !isAdmin && message.senderId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para ver este mensaje." });
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener el mensaje." });
  }
};

// Update a conversation message
exports.update = async (req, res) => {
  try {
    const messageId = req.params.id;
    const conversationId = req.params.conversationId;
    const userId = req.user.id;
    const { message: updatedMessage } = req.body;

    if (!updatedMessage) {
      return res.status(400).json({ message: "El campo message es obligatorio." });
    }

    // Verify conversation exists
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Find the message
    const messageRecord = await ConversationMessage.findOne({
      where: { id: messageId, conversationId }
    });

    if (!messageRecord) {
      return res.status(404).json({ message: "Mensaje no encontrado." });
    }

    // Check if user is the owner of the message (only sender can edit)
    if (messageRecord.senderId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para editar este mensaje." });
    }

    await messageRecord.update({ message: updatedMessage });

    res.status(200).json(messageRecord);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al actualizar el mensaje." });
  }
};

// Delete a conversation message
exports.delete = async (req, res) => {
  try {
    const messageId = req.params.id;
    const conversationId = req.params.conversationId;
    const userId = req.user.id;

    // Verify conversation exists
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    // Find the message
    const message = await ConversationMessage.findOne({
      where: { id: messageId, conversationId }
    });

    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado." });
    }

    // Check if user is the owner of the message (only sender can delete)
    if (message.senderId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este mensaje." });
    }

    await ConversationMessage.destroy({
      where: { id: messageId }
    });

    res.status(200).json({ message: "Mensaje eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al eliminar el mensaje." });
  }
};