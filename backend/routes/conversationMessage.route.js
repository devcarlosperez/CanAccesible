module.exports = (app) => {
  const conversationMessages = require("../controllers/conversationMessage.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", verifyToken, conversationMessages.create);

  router.get("/", verifyToken, conversationMessages.findAll);

  router.get("/:id", verifyToken, conversationMessages.findOne);

  router.put("/:id", verifyToken, conversationMessages.update);

  router.delete("/:id", verifyToken, conversationMessages.delete);

  app.use("/api/conversations", router);
};