module.exports = (app) => {
  const incidents = require("../controllers/incident.controller");
  const incidentImageUpload = require("../middlewares/incidentImageUpload");
  const { verifyToken, verifyTokenOrSession } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post(
    "/",
    verifyTokenOrSession,
    incidentImageUpload.single("image"),
    incidents.create
  );

  router.get("/", incidents.findAll);

  router.get("/my-incidents", verifyToken, incidents.findMyIncidents);

  router.get("/:id", incidents.findOne);

  router.put(
    "/:id",
    verifyTokenOrSession,
    incidentImageUpload.single("image"),
    incidents.update
  );

  router.delete("/:id", verifyTokenOrSession, incidents.delete);

  app.use("/api/incidents", router);
};
