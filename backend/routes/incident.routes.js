module.exports = (app) => {
  const incidents = require("../controllers/incident.controller");

  const router = require("express").Router();

  router.post("/", incidents.create);

  router.get("/", incidents.findAll);

  router.get("/:id", incidents.findOne);

  router.put("/:id", incidents.update);

  router.delete("/:id", incidents.delete);

  app.use("/api/incidents", router);
};