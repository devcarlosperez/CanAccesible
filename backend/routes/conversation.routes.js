module.exports = (app) => {
  const conversations = require("../controllers/conversation.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifyToken, conversations.create);

  router.get("/", verifyToken, conversations.findAll);

  router.get("/:id", verifyToken, conversations.findOne);

  router.put("/:id", verifyToken, conversations.update);

  router.delete("/:id", verifyToken, conversations.delete);

  app.use("/api/conversations", router);
};