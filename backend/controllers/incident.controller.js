const db = require("../models");
const axios = require("axios");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/doSpacesClient");
const incidentObject = db.incident;

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
    console.error("Error en geocodificación:", err.message);
    return null;
  }
}

// Utility function to delete image from DO Spaces
async function deleteImageFromStorage(nameFile) {
  if (!nameFile) return;
  try {
    const urlParts = nameFile.split('/');
    const key = urlParts.slice(-2).join('/');
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_NAME,
      Key: key,
    }));
  } catch (err) {
    console.error("Error eliminando imagen del storage:", err.message);
  }
}

// Create a new incident report
exports.create = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name)
      return res.status(400).json({ message: "name es obligatorio" });
    if (!req.body.description)
      return res.status(400).json({ message: "description es obligatorio" });
    if (!req.body.latitude)
      return res.status(400).json({ message: "latitude es obligatorio" });
    if (!req.body.longitude)
      return res.status(400).json({ message: "longitude es obligatorio" });
    if (!req.body.userId)
      return res.status(400).json({ message: "userId es obligatorio" });
    if (!req.body.incidentTypeId)
      return res.status(400).json({ message: "incidentTypeId es obligatorio" });
    if (!req.body.incidentSeverityId)
      return res.status(400).json({ message: "incidentSeverityId es obligatorio" });
    if (!req.body.incidentStatusId)
      return res.status(400).json({ message: "incidentStatusId es obligatorio" });
    if (!req.file)
      return res.status(400).json({ message: "Image es obligatorio" });

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
      incidentStatusId: req.body.incidentStatusId,
      incidentSeverityId: incidentSeverityIdFromBody,
      incidentTypeId: req.body.incidentTypeId,
      userId: req.body.userId,
      name: req.body.name,
      description: req.body.description,
      island: req.body.island,
      area: req.body.area,
      address: addressFromBody,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      dateIncident: req.body.dateIncident,
      nameFile: nameFile,
      isApproved: isApprovedDefault,
    };

    const newIncident = await incidentObject.create(incidentToCreate);
    res.status(201).json(newIncident);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Algún error ocurrió mientras se creaba la incidencia.",
    });
  }
};

// Retrieves all incidents from the database
exports.findAll = async (req, res) => {
  try {
    const data = await incidentObject.findAll({
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['firstName', 'lastName', 'nameFile'],
      }],
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Algún error ocurrió mientras se leían las incidencias.",
    });
  }
};


// Retrieves a single incident by ID
exports.findOne = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const data = await incidentObject.findOne({ where: { id: incidentId } });

    if (!data) {
      return res.status(404).json({ message: "Incidencia no encontrada." });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Algún error ocurrió mientras se leía la incidencia.",
    });
  }
};

// Updates an existing incident
exports.update = async (req, res) => {
  try {
    const incidentToUpdate = {};
    const incidentId = req.params.id;

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
    if (req.body.description !== undefined) incidentToUpdate.description = req.body.description;
    if (req.body.incidentStatusId !== undefined) incidentToUpdate.incidentStatusId = req.body.incidentStatusId;
    if (req.body.incidentTypeId !== undefined) incidentToUpdate.incidentTypeId = req.body.incidentTypeId;
    if (req.body.isApproved !== undefined) incidentToUpdate.isApproved = req.body.isApproved;
    if (req.body.userId !== undefined) incidentToUpdate.userId = req.body.userId;
    if (req.body.area !== undefined) incidentToUpdate.area = req.body.area;
    if (req.body.island !== undefined) incidentToUpdate.island = req.body.island;
    if (req.body.dateIncident !== undefined) incidentToUpdate.dateIncident = req.body.dateIncident;

    if (req.file) {
      const oldIncident = await incidentObject.findOne({ where: { id: incidentId } });
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

    res.status(404).json({ message: "Incidencia no encontrada." });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Algún error ocurrió mientras se actualizaba la incidencia.",
    });
  }
};

// Deletes an incidence by ID
exports.delete = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const incident = await incidentObject.findOne({ where: { id: incidentId } });

    if (!incident) {
      return res.status(404).json({ message: "Incidencia no encontrada." });
    }

    await deleteImageFromStorage(incident.nameFile);
    await incidentObject.destroy({ where: { id: incidentId } });

    res.status(200).json({
      message: "La incidencia y su imagen asociada han sido eliminadas.",
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Algún error ocurrió mientras se eliminaba la incidencia.",
    });
  }
};