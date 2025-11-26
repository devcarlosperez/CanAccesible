module.exports = (app) => {
  const incidentLikes = require("../controllers/incidentLikes.controller");

  const router = require("express").Router();

  router.post("/", incidentLikes.create);

  router.get("/", incidentLikes.findAll);

  router.get("/:id", incidentLikes.findOne);

  router.get("/incident/:incidentId/user/:userId", incidentLikes.findByIncidentAndUser);

  router.put("/:id", incidentLikes.update);

  router.delete("/:id", incidentLikes.delete);

  app.use("/api/incidentLikes", router);
};