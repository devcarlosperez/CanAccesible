module.exports = (app) => {
  const incidents = require("../controllers/incident.controller");
  const incidentImageUpload = require("../middlewares/incidentImageUpload");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifyToken, incidentImageUpload.single("image"), incidents.create);

  router.get("/", incidents.findAll);

  router.get("/:id", incidents.findOne);

  router.put("/:id", verifyToken, incidentImageUpload.single("image"), incidents.update);

  router.delete("/:id", verifyToken, incidents.delete);

  app.use("/api/incidents", router);
};