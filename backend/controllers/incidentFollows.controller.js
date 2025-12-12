const db = require("../models");
const incidentFollowObject = db.incidentFollow;

// Follow an incident
exports.create = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.incidentId)
      return res.status(400).json({ message: "incidentId is required" });

    // Get userId from the token (req.user is set by verifyToken middleware)
    const userId = req.user.id;

    // Check if the user is already following this incident
    const existingFollow = await incidentFollowObject.findOne({
      where: { incidentId: req.body.incidentId, userId: userId },
    });

    if (existingFollow) {
      return res.status(400).json({ message: "You are already following this incident." });
    }

    // Use current date if not provided
    const dateFollowed = req.body.dateFollowed || new Date();

    const newIncidentFollow = await incidentFollowObject.create({
      incidentId: req.body.incidentId,
      userId: userId,
      dateFollowed: dateFollowed,
    });

    return res.status(201).json(newIncidentFollow);
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while following the incident.",
    });
  }
};

// Retrieves all incidents from the database
exports.findAll = async (req, res) => {
  try {
    const data = await incidentFollowObject.findAll({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving incident follows.",
    });
  }
};

// Retrieves a single incident by ID
exports.findOne = async (req, res) => {
  try {
    const incidentFollowId = req.params.id;
    const data = await incidentFollowObject.findOne({
      where: { id: incidentFollowId },
    });

    if (!data) {
      return res.status(404).json({ message: "IncidentFollow not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving the IncidentFollow.",
    });
  }
};

// Retrieves a single incident follow by incidentId and userId
exports.findByIncidentAndUser = async (req, res) => {
  try {
    const { incidentId, userId } = req.params;

    // Search for the follow by incidentId and userId
    const follow = await incidentFollowObject.findOne({
      where: {
        incidentId: incidentId,
        userId: userId,
      },
    });

    if (follow) {
      return res.status(200).json(follow);
    } else {
      return res
        .status(404)
        .json({ message: "Follow not found for this user and incident." });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An error occurred while retrieving the incident follow.",
    });
  }
};

// Updates an existing incident
exports.update = async (req, res) => {
  res.status(403).json({ message: "Follows cannot be updated" });
};

// Deletes an incidence by ID
exports.delete = async (req, res) => {
  try {
    const incidentFollowId = req.params.id;
    const incidentFollow = await incidentFollowObject.findOne({
      where: { id: incidentFollowId },
    });

    if (!incidentFollow) {
      return res.status(404).json({ message: "IncidentFollow not found." });
    }

    // Check permissions: only the creator can delete
    if (req.user.id !== incidentFollow.userId) {
      return res.status(403).json({ message: "You do not have permission to delete this follow." });
    }

    await incidentFollowObject.destroy({ where: { id: incidentFollowId } });

    res.status(200).json({
      message: "IncidentFollow has been deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while deleting the IncidentFollow.",
    });
  }
};

// Retrieve all follows for a specific incident
exports.findByIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const data = await incidentFollowObject.findAll({
      where: { incidentId: incidentId },
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving incident follows.",
    });
  }
};
