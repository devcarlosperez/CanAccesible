const db = require("../models");
const axios = require("axios");
const incidenceObject = db.incidence;

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
    console.error("Error finding the location", err);
    return null;
  }
}

// Create a new incidence report
exports.create = async (req, res) => {
  // Get address from coordinates using reverse geocoding
  const locationData = await reverseGeocode(
    req.body.latitude,
    req.body.longitude
  );

  const addressFromBody = locationData?.display_name || null;

  // New incidences are not approved by default
  let isApprovedDefault = false;
  let incidenceSeverityIdFromBody = null;

  // Severity is only applicable for incidenceTypeId = 2
  if (Number(req.body.incidenceTypeId) === 2) {
    incidenceSeverityIdFromBody = req.body.incidenceSeverityId;
  }

  const incidenceToCreate = {
    incidenceStatusId: req.body.incidenceStatusId,
    incidenceSeverityId: incidenceSeverityIdFromBody,
    incidenceTypeId: req.body.incidenceTypeId,
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
    island: req.body.island,
    area: req.body.area,
    address: addressFromBody,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    dateIncidence: req.body.dateIncidence,
    isApproved: isApprovedDefault,
  };

  incidenceObject
    .create(incidenceToCreate)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while creating the incidence.",
      });
    });
};

// Retrieves all incidences from the database
exports.findAll = (req, res) => {
  incidenceObject
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving the incidences.",
      });
    });
};

// Retrieves a single incidence by ID
exports.findOne = (req, res) => {
  const incidenceId = req.params.id;

  incidenceObject
    .findOne({ where: { id: incidenceId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving the incidence.",
      });
    });
};

// Updates an existing incidence
exports.update = async (req, res) => {
  const incidenceToUpdate = {};
  const incidenceId = req.params.id;

  // If coordinates are provided, update location and re-geocode address
  if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    const locationData = await reverseGeocode(
      req.body.latitude,
      req.body.longitude
    );
    incidenceToUpdate.latitude = req.body.latitude;
    incidenceToUpdate.longitude = req.body.longitude;
    incidenceToUpdate.address = locationData?.display_name || null;
  }

  // Update other fields only if they are provided
  if (req.body.name !== undefined) {
    incidenceToUpdate.name = req.body.name;
  }
  if (req.body.description !== undefined) {
    incidenceToUpdate.description = req.body.description;
  }
  if (req.body.incidenceStatusId !== undefined) {
    incidenceToUpdate.incidenceStatusId = req.body.incidenceStatusId;
  }
  if (req.body.incidenceTypeId !== undefined) {
    incidenceToUpdate.incidenceTypeId = req.body.incidenceTypeId;
  }
  if (req.body.isApproved !== undefined) {
    incidenceToUpdate.isApproved = req.body.isApproved;
  }
  if (req.body.userId !== undefined) {
    incidenceToUpdate.userId = req.body.userId;
  }
  if (req.body.area !== undefined) {
    incidenceToUpdate.area = req.body.area;
  }
  if (req.body.island !== undefined) {
    incidenceToUpdate.island = req.body.island;
  }
  if (req.body.dateIncidence !== undefined) {
    incidenceToUpdate.dateIncidence = req.body.dateIncidence;
  }

  // Handle severity assignment - only for incidenceTypeId = 2
  if (req.body.incidenceTypeId !== undefined) {
    if (req.body.incidenceTypeId === 2) {
      incidenceToUpdate.incidenceSeverityId = req.body.incidenceSeverityId;
    } else {
      incidenceToUpdate.incidenceSeverityId = null;
    }
  }

  incidenceObject
    .update(incidenceToUpdate, { where: { id: incidenceId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while updating the incidence.",
      });
    });
};

// Deletes an incidence by ID
exports.delete = (req, res) => {
  const incidenceId = req.params.id;

  incidenceObject
    .destroy({ where: { id: incidenceId } })
    .then((data) => {
      res.send({
        message: "Incidence has been deleted.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error ocurred while deleting the incidence.",
      });
    });
};
