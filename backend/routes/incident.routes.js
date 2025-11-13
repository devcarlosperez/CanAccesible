module.exports = (app) => {
  const incidents = require("../controllers/incident.controller");
  const incidentImageUpload = require("../middleware/incidentImageUpload");

  const router = require("express").Router();

  router.post("/", incidentImageUpload.single("image"), incidents.create);

  router.get("/", incidents.findAll);

  router.get("/:id", incidents.findOne);

  router.put("/:id", incidentImageUpload.single("image"), incidents.update);

  router.delete("/:id", incidents.delete);

  app.use("/api/incidents", router);
};