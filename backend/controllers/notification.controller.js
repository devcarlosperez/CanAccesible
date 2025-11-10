const db = require("../models");
const Notification = db.notification;

// Create a notification
exports.create = async (req, res) => {
  try {
    const { userId, entity, entityId, message, dateNotification } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: "userId es obligatorio" });
    }
    if (!entity) {
      return res.status(400).json({ message: "entity es obligatorio" });
    }
    if (entityId === undefined || entityId === null) {
      return res.status(400).json({ message: "entityId es obligatorio" });
    }
    if (!message) {
      return res.status(400).json({ message: "message es obligatorio" });
    }

    const notification = await Notification.create({
      userId,
      entity,
      entityId,
      message,
      dateNotification,
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating notification." });
  }
};

// Retrieve all notifications
exports.findAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching notifications." });
  }
};

// Retrieve one notification by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching notification." });
  }
};

// Update a notification
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Notification.update(req.body, { where: { id } });
    if (updated) {
      const updatedNotification = await Notification.findByPk(id);
      return res.json(updatedNotification);
    }else{
      res.status(404).json({ message: "Notification not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating notification." });
  }
};

// Delete a notification
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Notification.destroy({ where: { id } });
    if (deleted) {
      return res.json({ message: "Notification deleted." });
    } else {
      res.status(404).json({ message: "Notification not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting notification." });
  }
};
