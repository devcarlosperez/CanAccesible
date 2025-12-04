module.exports = (app) => {
  const incidentComments = require("../controllers/incidentComment.controller");

  const router = require("express").Router();

  // Create a new comment
  router.post("/", incidentComments.create);

  // Get all comments for a specific incident
  router.get("/incident/:incidentId", incidentComments.findByIncident);

  // Get a single comment by id
  router.get("/:id", incidentComments.findOne);

  // Update a comment
  router.put("/:id", incidentComments.update);

  // Delete a comment
  router.delete("/:id", incidentComments.delete);

  app.use("/api/incident-comments", router);
};
