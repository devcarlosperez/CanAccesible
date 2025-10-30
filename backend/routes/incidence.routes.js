module.exports = (app) => {
  const incidences = require("../controllers/incidence.controller");

  const router = require("express").Router();

  router.post("/", incidences.create);

  router.get("/", incidences.findAll);

  router.get("/:id", incidences.findOne);

  router.put("/:id", incidences.update);

  router.delete("/:id", incidences.delete);

  app.use("/api/incidences", router);
};