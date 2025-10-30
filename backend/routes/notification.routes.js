module.exports = (app) => {
  const notifications = require("../controllers/notification.controller");

  const router = require("express").Router();

  router.post("/", notifications.create);

  router.get("/", notifications.findAll);

  router.get("/:id", notifications.findOne);

  router.put("/:id", notifications.update);

  router.delete("/:id", notifications.delete);

  app.use("/api/notifications", router);
};