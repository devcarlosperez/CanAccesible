const db = require('../models');
const { verifySession } = require("../middlewares/auth.middleware");
const Log = db.log;
const { createLog } = require('../services/log.service');

// Create a log
exports.create = async (req, res) => {
  try {
    // Verify that user is authenticated
    if (!req.user) {
      return res.status(403).json({ message: "You do not have permission to create logs." });
    }

    const { userId, action, entity, entityId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!action) {
      return res.status(400).json({ message: "action is required" });
    }
    if (!entity) {
      return res.status(400).json({ message: "entity is required" });
    }
    if (!entityId) {
      return res.status(400).json({ message: "entityId is required" });
    }

    const log = await createLog(userId, action, entity, entityId);
    
    if (!log) {
      return res.status(500).json({ message: "Error creating log. Check console for details." });
    }
    
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all logs
exports.findAll = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to access logs." });
    }

    const logs = await Log.findAll({
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve one log by ID
exports.findOne = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to access logs." });
    }

    const log = await Log.findByPk(req.params.id, {
    });
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a log - Not allowed
exports.update = async (req, res) => {
  res.status(403).json({ message: "Logs cannot be updated" });
};

// Delete a log
exports.delete = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to delete logs." });
    }

    const log = await Log.findByPk(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    await log.destroy();
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
