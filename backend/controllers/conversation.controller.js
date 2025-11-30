const db = require("../models");
const { verifyToken } = require("../middlewares/auth.middleware");
const Conversation = db.conversation;

// Create a new conversation
exports.create = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the JWT token
    const { type } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!type) {
      return res.status(400).json({ message: "type is required" });
    }

    const conversation = await Conversation.create({
      userId,
      type
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating the conversation." });
  }
};

// Retrieve all conversations
exports.findAll = async (req, res) => {
  try {
    const userId = req.user.id;

    // If admin, retrieve all; otherwise, only user's own conversations
    const where = req.user.role === 'admin' ? {} : { userId };

    const conversations = await Conversation.findAll({
      where
    });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving conversations." });
  }
};

// Retrieve a conversation by ID
exports.findOne = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const conversation = await Conversation.findOne({
      where: { id: conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    // Verify authorization: owner or admin
    if (conversation.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "You do not have permission to access this conversation." });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving the conversation." });
  }
};

// Update a conversation - conversations cannot be updated
exports.update = async (req, res) => {
  return res.status(400).json({ message: "Conversations cannot be updated." });
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
      return res.status(404).json({ message: "Conversation not found." });
    }

    // Verify authorization: owner or admin
    if (conversation.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: "You do not have permission to delete this conversation." });
    }

    // Delete conversation
    await Conversation.destroy({
      where: { id: conversationId }
    });

    res.status(200).json({ 
      message: "Conversation deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting the conversation." });
  }
};