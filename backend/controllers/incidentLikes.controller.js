const db = require("../models");
const incidentLikeObject = db.incidentLike;
const { getIo } = require("../services/socket.service");

// Like an incident
exports.create = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.incidentId)
      return res.status(400).json({ message: "incidentId is required" });

    // Get userId from the token (req.user is set by verifyToken middleware)
    const userId = req.user.id;

    // Check if the user has already liked this incident
    const existingLike = await incidentLikeObject.findOne({
      where: { incidentId: req.body.incidentId, userId: userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this incident." });
    }

    // Use current date if not provided
    const dateLike = req.body.dateLike || new Date();

    const newIncidentLike = await incidentLikeObject.create({
      incidentId: req.body.incidentId,
      userId: userId,
      dateLike: dateLike,
    });

    // Count total likes for this incident
    const count = await incidentLikeObject.count({
      where: { incidentId: req.body.incidentId },
    });

    // Emit update to room
    const io = getIo();
    if (io) {
      io.to(`incident_${req.body.incidentId}`).emit("incident:likes_update", {
        incidentId: req.body.incidentId,
        count: count,
      });
    }

    return res.status(201).json(newIncidentLike);
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while liking the incident.",
    });
  }
};

// Retrieves all incidents from the database
exports.findAll = async (req, res) => {
  try {
    const data = await incidentLikeObject.findAll({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving incident likes.",
    });
  }
};

// Retrieves a single incident by ID
exports.findOne = async (req, res) => {
  try {
    const incidentLikeId = req.params.id;
    const data = await incidentLikeObject.findOne({ where: { id: incidentLikeId } });

    if (!data) {
      return res.status(404).json({ message: "IncidentLike not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving the IncidentLike.",
    });
  }
};

// Retrieves a single incident like by incidentId and userId
exports.findByIncidentAndUser = async (req, res) => {
  try {
    const { incidentId, userId } = req.params;

    // Search for the like by incidentId and userId
    const like = await incidentLikeObject.findOne({
      where: {
        incidentId: incidentId,
        userId: userId,
      },
    });

    if (like) {
      return res.status(200).json(like);
    } else {
      return res.status(404).json({ message: "Like not found for this user and incident." });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while retrieving the incident like.",
    });
  }
};

// Updates an existing incident
exports.update = async (req, res) => {
  res.status(403).json({ message: "Likes cannot be updated" });
};

// Deletes an incidence by ID
exports.delete = async (req, res) => {
  try {
    const incidentLikeId = req.params.id;
    const incidentLike = await incidentLikeObject.findOne({
      where: { id: incidentLikeId },
    });

    if (!incidentLike) {
      return res.status(404).json({ message: "IncidentLike not found." });
    }

    // Check permissions: only the creator can delete
    if (req.user.id !== incidentLike.userId) {
      return res.status(403).json({ message: "You do not have permission to delete this like." });
    }

    await incidentLikeObject.destroy({ where: { id: incidentLikeId } });

    // Count total likes for this incident
    const count = await incidentLikeObject.count({
      where: { incidentId: incidentLike.incidentId },
    });

    // Emit update to room
    const io = getIo();
    if (io) {
      io.to(`incident_${incidentLike.incidentId}`).emit("incident:likes_update", {
        incidentId: incidentLike.incidentId,
        count: count,
      });
    }

    res.status(200).json({
      message: "IncidentLike has been deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while deleting the IncidentLike.",
    });
  }
};
