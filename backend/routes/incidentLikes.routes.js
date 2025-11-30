module.exports = (app) => {
  const incidentLikes = require("../controllers/incidentLikes.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifyToken, incidentLikes.create);

  router.get("/", incidentLikes.findAll);

  router.get("/:id", incidentLikes.findOne);

  router.get("/incident/:incidentId/user/:userId", incidentLikes.findByIncidentAndUser);

  router.put("/:id", verifyToken, incidentLikes.update);

  router.delete("/:id", verifyToken, incidentLikes.delete);

  app.use("/api/incidentLikes", router);
};