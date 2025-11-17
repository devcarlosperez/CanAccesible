const db = require("../models");
const Conversation = db.conversation;

// Create a conversation
exports.create = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId es obligatorio" });
    }

    const conversation = await Conversation.create({
      userId
    })

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al crear la conversación." });
  }
}

// Retrieve all conversations
exports.findAll = async (req, res) => {
  
}

// Retrieve one conversation by ID
exports.findOne = async (req, res) => {
  
}

// Update a conversation
exports.update = async (req, res) => {
  
}

// Delete a conversation
exports.delete = async (req, res) => {
  
}