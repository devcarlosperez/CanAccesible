module.exports = (app) => {
  const notifications = require("../controllers/notification.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  // Protected routes
  router.post("/", verifyToken, notifications.create);
  router.get("/", verifyToken, notifications.findAll);
  router.get("/:id", verifyToken, notifications.findOne);
  router.put("/:id", verifyToken, notifications.update);
  router.delete("/:id", verifyToken, notifications.delete);

  app.use("/api/notifications", router);
};
