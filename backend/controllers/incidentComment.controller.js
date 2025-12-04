const db = require("../models");
const IncidentComment = db.incidentComment;
const User = db.user;
const Incident = db.incident;

// Create a new comment
exports.create = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!req.body.incidentId) {
      return res.status(400).json({ message: "incidentId is required" });
    }
    if (!req.body.comment) {
      return res.status(400).json({ message: "comment is required" });
    }

    const incident = await Incident.findByPk(req.body.incidentId);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const commentToCreate = {
      userId: req.body.userId,
      incidentId: req.body.incidentId,
      comment: req.body.comment,
      dateComment: req.body.dateComment || new Date(),
    };

    const newComment = await IncidentComment.create(commentToCreate);

    // Fetch the created comment with user information
    const commentWithUser = await IncidentComment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      message: "Error creating comment",
      error: error.message,
    });
  }
};

exports.findByIncident = async (req, res) => {
  try {
    const incidentId = req.params.incidentId;

    if (!incidentId) {
      return res.status(400).json({ message: "incidentId is required" });
    }

    const comments = await IncidentComment.findAll({
      where: { incidentId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await IncidentComment.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Incident,
          as: "incident",
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({
      message: "Error fetching comment",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await IncidentComment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.body.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this comment",
      });
    }

    const updatedData = {
      comment: req.body.comment || comment.comment,
    };

    await comment.update(updatedData);

    const updatedComment = await IncidentComment.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await IncidentComment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== req.body.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};
