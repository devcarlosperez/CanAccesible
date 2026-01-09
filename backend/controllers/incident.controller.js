const db = require("../models");
const axios = require("axios");
const { deleteImageFromStorage } = require("../config/doSpacesClient");
const incidentObject = db.incident;
const Notification = db.notification;

// Using OpenStreetMap's Nominatim reverse geocoding service
async function reverseGeocode(latitude, longitude) {
  try {
    const responseNominatin = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "CanariasAccesibleApp/1.0",
        },
      }
    );
    return responseNominatin.data;
  } catch (err) {
    console.error("Error in geocoding:", err.message);
    return null;
  }
}

// Create a new incident report
exports.create = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name)
      return res.status(400).json({ message: "name is required" });
    if (!req.body.description)
      return res.status(400).json({ message: "description is required" });
    if (!req.body.latitude)
      return res.status(400).json({ message: "latitude is required" });
    if (!req.body.longitude)
      return res.status(400).json({ message: "longitude is required" });
    if (!req.body.incidentTypeId)
      return res.status(400).json({ message: "incidentTypeId is required" });
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const locationData = await reverseGeocode(
      req.body.latitude,
      req.body.longitude
    );

    const addressFromBody = locationData?.display_name || null;

    let isApprovedDefault = false;
    let incidentSeverityIdFromBody = null;

    if (Number(req.body.incidentTypeId) === 2) {
      incidentSeverityIdFromBody = req.body.incidentSeverityId;
    }

    const nameFile = req.file.location;

    const incidentToCreate = {
      incidentStatusId: req.body.incidentStatusId || 1,
      incidentSeverityId: incidentSeverityIdFromBody,
      incidentTypeId: req.body.incidentTypeId,
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
      island: req.body.island,
      area: req.body.area,
      address: addressFromBody,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      dateIncident: req.body.dateIncident || new Date(),
      nameFile: nameFile,
      isApproved: isApprovedDefault,
    };

    const newIncident = await incidentObject.create(incidentToCreate);

    // Create notification for the user
    await Notification.create({
      userId: req.user.id,
      entity: "Incident",
      entityId: newIncident.id,
      message: `La incidencia "${newIncident.name}" ha sido enviada para su revisión.`,
    });

    return res.status(201).json(newIncident);
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while creating the incident.",
    });
  }
};

// Retrieves all incidents from the database
exports.findAll = async (req, res) => {
  try {
    const data = await incidentObject.findAll({
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["firstName", "lastName", "nameFile"],
        },
      ],
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while retrieving incidents.",
    });
  }
};

// Retrieves a single incident by ID
exports.findOne = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const data = await incidentObject.findOne({ where: { id: incidentId } });

    if (!data) {
      return res.status(404).json({ message: "Incident not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving the incident.",
    });
  }
};

// Updates an existing incident
exports.update = async (req, res) => {
  try {
    const incidentToUpdate = {};
    const incidentId = req.params.id;

    const incident = await incidentObject.findOne({
      where: { id: incidentId },
    });
    if (!incident) {
      return res.status(404).json({ message: "Incident not found." });
    }

    // Check permissions: only creator or admin can update
    if (req.user.id !== incident.userId && req.user.roleId !== 2) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to update this incident.",
        });
    }

    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      const locationData = await reverseGeocode(
        req.body.latitude,
        req.body.longitude
      );
      incidentToUpdate.latitude = req.body.latitude;
      incidentToUpdate.longitude = req.body.longitude;
      incidentToUpdate.address = locationData?.display_name || null;
    }

    if (req.body.name !== undefined) incidentToUpdate.name = req.body.name;
    if (req.body.description !== undefined)
      incidentToUpdate.description = req.body.description;
    if (req.body.incidentStatusId !== undefined)
      incidentToUpdate.incidentStatusId = req.body.incidentStatusId;
    if (req.body.incidentTypeId !== undefined)
      incidentToUpdate.incidentTypeId = req.body.incidentTypeId;
    if (req.body.isApproved !== undefined)
      incidentToUpdate.isApproved = req.body.isApproved;
    if (req.body.userId !== undefined && req.user.roleId === 2)
      incidentToUpdate.userId = req.body.userId;
    if (req.body.area !== undefined) incidentToUpdate.area = req.body.area;
    if (req.body.island !== undefined)
      incidentToUpdate.island = req.body.island;
    if (req.body.dateIncident !== undefined)
      incidentToUpdate.dateIncident = req.body.dateIncident;

    if (req.file) {
      const oldIncident = await incidentObject.findOne({
        where: { id: incidentId },
      });
      if (oldIncident) await deleteImageFromStorage(oldIncident.nameFile);
      incidentToUpdate.nameFile = req.file.location;
    }

    if (req.body.incidentTypeId !== undefined) {
      if (req.body.incidentTypeId === 2) {
        incidentToUpdate.incidentSeverityId = req.body.incidentSeverityId;
      } else {
        incidentToUpdate.incidentSeverityId = null;
      }
    }

    const [updated] = await incidentObject.update(incidentToUpdate, {
      where: { id: incidentId },
    });

    if (updated) {
      const updatedIncident = await incidentObject.findOne({
        where: { id: incidentId },
      });
      return res.status(200).json(updatedIncident);
    }

    res.status(404).json({ message: "Incident not found." });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while updating the incident.",
    });
  }
};

// Deletes an incidence by ID
exports.delete = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const incident = await incidentObject.findOne({
      where: { id: incidentId },
    });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found." });
    }

    // Check permissions: only creator or admin can delete
    if (req.user.id !== incident.userId && req.user.roleId !== 2) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to delete this incident.",
        });
    }

    await deleteImageFromStorage(incident.nameFile);
    await incidentObject.destroy({ where: { id: incidentId } });

    res.status(200).json({
      message: "Incident and its associated image have been deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while deleting the incident.",
    });
  }
};

// Retrieves all incidents created by the authenticated user with like count
exports.findMyIncidents = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await incidentObject.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.incidentLike,
          as: "likes",
          attributes: ["id"],
        },
        {
          model: db.incidentStatus,
          as: "status",
          attributes: ["status"],
        },
      ],
    });

    // Transform data to include like count
    const incidentsWithLikes = data.map((incident) => {
      const incidentJson = incident.toJSON();
      incidentJson.likesCount = incidentJson.likes.length;
      delete incidentJson.likes; // Remove the array to keep it clean
      return incidentJson;
    });

    res.status(200).json(incidentsWithLikes);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error occurred while retrieving user incidents.",
    });
  }
};
