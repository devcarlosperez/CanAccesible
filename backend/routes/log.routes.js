module.exports = (app) => {
  const log = require("../controllers/log.controller");
  const { createLog } = require("../services/log.service");
  const { verifySession } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifySession, createLog);

  router.get("/", verifySession, log.findAll);

  router.get("/:id", verifySession, log.findOne);

  router.put("/:id", verifySession, log.update);

  router.delete("/:id", verifySession, log.delete);

  app.use("/api/logs", router);
};
