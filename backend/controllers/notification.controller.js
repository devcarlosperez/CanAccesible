const db = require("../models");
const Notification = db.notification;

// Create a notification
exports.create = async (req, res) => {
  const { userId, entity, entityId, message, dateNotification } = req.body;

  // Validate required fields
  if (!userId) {
    return res.status(400).send({ message: "userId es obligatorio" });
  }
  if (!entity) {
    return res.status(400).send({ message: "entity es obligatorio" });
  }
  if (entityId === undefined || entityId === null) {
    return res.status(400).send({ message: "entityId es obligatorio" });
  }
  if (!message) {
    return res.status(400).send({ message: "message es obligatorio" });
  }

  Notification
    .create({
      userId,
      entity,
      entityId,
      message,
      dateNotification,
    })
    .then((notification) => {
      res.status(201).send(notification);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error creating notification." });
    });
};

// Retrieve all notifications
exports.findAll = (req, res) => {
  Notification
    .findAll()
    .then((notifications) => {
      res.send(notifications);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error fetching notifications." });
    });
};

// Retrieve one notification by ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  
  Notification
    .findByPk(id)
    .then((notification) => {
      if (!notification) {
        return res.status(404).send({ message: "Notification not found." });
      }
      res.send(notification);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error fetching notification." });
    });
};

// Update a notification
exports.update = (req, res) => {
  const id = req.params.id;
  
  Notification
    .update(req.body, { where: { id } })
    .then((updated) => {
      if (updated[0]) {
        return Notification.findByPk(id)
          .then((updatedNotification) => {
            res.send(updatedNotification);
          });
      } else {
        res.status(404).send({ message: "Notification not found." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error updating notification." });
    });
};

// Delete a notification
exports.delete = (req, res) => {
  const id = req.params.id;
  
  Notification
    .destroy({ where: { id } })
    .then((deleted) => {
      if (deleted) {
        res.send({ message: "Notification deleted." });
      } else {
        res.status(404).send({ message: "Notification not found." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error deleting notification." });
    });
};
