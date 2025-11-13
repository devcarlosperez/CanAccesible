const db = require("../models");
const Notification = db.notification;

// Create a notification
exports.create = async (req, res) => {
  try {
    const { userId, entity, entityId, message, dateNotification } = req.body;

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
    res.status(500).json({ message: err.message || "Error al crear la notificación." });
  }
};

// Retrieve all notifications
exports.findAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener notificaciones." });
  }
};

// Retrieve one notification by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada." });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener la notificación." });
  }
};

// Update a notification
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Notification.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "Notificación no encontrada." });
    }

    const updatedNotification = await Notification.findByPk(id);
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al actualizar la notificación." });
  }
};

// Delete a notification
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Notification.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Notificación no encontrada." });
    }

    res.status(200).json({ message: "Notificación eliminada correctamente." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al eliminar la notificación." });
  }
};
