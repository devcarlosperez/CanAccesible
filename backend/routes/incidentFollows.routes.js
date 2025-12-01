module.exports = (app) => {
  const incidentFollows = require("../controllers/incidentFollows.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifyToken, incidentFollows.create);

  router.get("/", incidentFollows.findAll);

  router.get("/:id", incidentFollows.findOne);

  router.get("/incident/:incidentId", incidentFollows.findByIncident);

  router.get(
    "/incident/:incidentId/user/:userId",
    incidentFollows.findByIncidentAndUser
  );

  router.put("/:id", verifyToken, incidentFollows.update);

  router.delete("/:id", verifyToken, incidentFollows.delete);

  app.use("/api/incidentFollows", router);
};
