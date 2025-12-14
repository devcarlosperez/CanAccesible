const { verifyToken } = require("../middlewares/auth.middleware");
const pushSubscription = require("../controllers/pushSubscription.controller");
const express = require("express");
const router = express.Router();

module.exports = (app) => {
  router.post("/subscribe", verifyToken, pushSubscription.subscribe);
  router.post("/unsubscribe", verifyToken, pushSubscription.unsubscribe);

  app.use("/api/push", router);
};
