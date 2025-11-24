const db = require('../models');
const { verifySession } = require("../middlewares/auth.middleware");
const Log = db.Log;

// Retrieve all logs
exports.findAll = async (req, res) => {
  try {
    // Verify that user is authenticated
    if (!req.user) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a los logs.' });
    }

    const logs = await Log.findAll({
      include: ['user'],
      order: [['dateLog', 'DESC']],
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve one log by ID
exports.findOne = async (req, res) => {
  try {
    // Verify that user is authenticated
    if (!req.user) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a los logs.' });
    }

    const log = await Log.findByPk(req.params.id, {
      include: ['user'],
    });
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a log - Not allowed
exports.update = async (req, res) => {
  res.status(403).json({ message: 'Logs cannot be updated' });
};

// Delete a log
exports.delete = async (req, res) => {
  try {
    // Verify that user is authenticated
    if (!req.user) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar logs.' });
    }

    const log = await Log.findByPk(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    await log.destroy();
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
