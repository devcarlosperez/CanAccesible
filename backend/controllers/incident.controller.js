const db = require("../models");
const axios = require("axios");
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
    const nominatinData = responseNominatin.data;

    return nominatinData;
  } catch (err) {
    console.error("Error encontrando la localización", err);
    return null;
  }
}

// Create a new incident report
exports.create = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title)
      return res.status(400).json({ message: "title es obligatorio" });
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

    // Get address from coordinates using reverse geocoding
    const locationData = await reverseGeocode(
      req.body.latitude,
      req.body.longitude
    );

    const addressFromBody = locationData?.display_name || null;

    // New incidents are not approved by default
    let isApprovedDefault = false;
    let incidentSeverityIdFromBody = null;

    // Severity is only applicable for incidentTypeId = 2
    if (Number(req.body.incidentTypeId) === 2) {
      incidentSeverityIdFromBody = req.body.incidentSeverityId;
    }

    const nameFile = req.file.location;

    const incidentToCreate = {
      incidentStatusId: req.body.incidentStatusId,
      incidentSeverityId: incidentSeverityIdFromBody,
      incidentTypeId: req.body.incidentTypeId,
      userId: req.body.userId,
      title: req.body.title,
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
exports.findAll = (req, res) => {
  incidentObject
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Algún error ocurrió mientras se leían las incidencias.",
      });
    });
};

// Retrieves a single incident by ID
exports.findOne = (req, res) => {
  const incidentId = req.params.id;

  incidentObject
    .findOne({ where: { id: incidentId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Algún error ocurrió mientras se leía la incidencia.",
      });
    });
};

// Updates an existing incident
exports.update = async (req, res) => {
  const incidentToUpdate = {};
  const incidentId = req.params.id;

  // If coordinates are provided, update location and re-geocode address
  if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    const locationData = await reverseGeocode(
      req.body.latitude,
      req.body.longitude
    );
    incidentToUpdate.latitude = req.body.latitude;
    incidentToUpdate.longitude = req.body.longitude;
    incidentToUpdate.address = locationData?.display_name || null;
  }

  // Update other fields only if they are provided
  if (req.body.title !== undefined) {
    incidentToUpdate.title = req.body.title;
  }
  if (req.body.description !== undefined) {
    incidentToUpdate.description = req.body.description;
  }
  if (req.body.incidentStatusId !== undefined) {
    incidentToUpdate.incidentStatusId = req.body.incidentStatusId;
  }
  if (req.body.incidentTypeId !== undefined) {
    incidentToUpdate.incidentTypeId = req.body.incidentTypeId;
  }
  if (req.body.isApproved !== undefined) {
    incidentToUpdate.isApproved = req.body.isApproved;
  }
  if (req.body.userId !== undefined) {
    incidentToUpdate.userId = req.body.userId;
  }
  if (req.body.area !== undefined) {
    incidentToUpdate.area = req.body.area;
  }
  if (req.body.island !== undefined) {
    incidentToUpdate.island = req.body.island;
  }
  if (req.body.dateIncident !== undefined) {
    incidentToUpdate.dateIncident = req.body.dateIncident;
  }

  // Handle image update if a new file is uploaded
  if (req.file) {
    incidentToUpdate.nameFile = req.file.location;
  }

  // Handle severity assignment - only for incidentTypeId = 2
  if (req.body.incidentTypeId !== undefined) {
    if (req.body.incidentTypeId === 2) {
      incidentToUpdate.incidentSeverityId = req.body.incidentSeverityId;
    } else {
      incidentToUpdate.incidentSeverityId = null;
    }
  }

  try {
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
exports.delete = (req, res) => {
  const incidentId = req.params.id;

  incidentObject
    .destroy({ where: { id: incidentId } })
    .then((data) => {
      res.send({
        message: "La incidencia ha sido eliminada.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Algún error ocurrió mientras se eliminaba la inciencia.",
      });
    });
};