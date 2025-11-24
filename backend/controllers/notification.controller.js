const db = require("../models");
const Notification = db.notification;

// Create a notification
exports.create = async (req, res) => {
  try {
    // User ID comes from JWT
    const userId = req.user.id;
    const { entity, entityId, message, dateNotification } = req.body;

    if (!entity) {
      return res.status(400).json({ message: "entity is required" });
    }
    if (entityId === undefined || entityId === null) {
      return res.status(400).json({ message: "entityId is required" });
    }
    if (!message) {
      return res.status(400).json({ message: "message is required" });
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
    res.status(500).json({
      message: err.message || "Failed to create notification.",
    });
  }
};

// Get all notifications for the authenticated user
exports.findAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
    });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to fetch notifications.",
    });
  }
};

// Get a single notification (only if it belongs to the user)
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found or does not belong to the user.",
      });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to fetch notification.",
    });
  }
};

// Update a notification (only if it belongs to the user)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const [updated] = await Notification.update(req.body, {
      where: { id, userId },
    });

    if (!updated) {
      return res.status(404).json({
        message: "Notification not found or does not belong to the user.",
      });
    }

    const updatedNotification = await Notification.findByPk(id);
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to update notification.",
    });
  }
};

// Delete a notification (only if it belongs to the user)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const deleted = await Notification.destroy({
      where: { id, userId },
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Notification not found or does not belong to the user.",
      });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete notification.",
    });
  }
};
