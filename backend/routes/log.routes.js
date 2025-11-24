module.exports = (app) => {
  const log = require("../controllers/log.controller");
  const { verifySession } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifySession, log.create);

  router.get("/", verifySession, log.findAll);

  router.get("/:id", verifySession, log.findOne);

  router.put("/:id", verifySession, log.update);

  router.delete("/:id", verifySession, log.delete);

  app.use("/api/logs", router);
};
