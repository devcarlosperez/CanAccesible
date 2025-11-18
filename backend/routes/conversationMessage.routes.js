module.exports = (app) => {
  const conversationMessages = require("../controllers/conversationMessage.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/:conversationId", verifyToken, conversationMessages.create);

  router.get("/:conversationId", verifyToken, conversationMessages.findAll);

  router.get("/:conversationId/:id", verifyToken, conversationMessages.findOne);

  router.put("/:conversationId/:id", verifyToken, conversationMessages.update);

  router.delete("/:conversationId/:id", verifyToken, conversationMessages.delete);

  app.use("/api/conversationMessages", router);
};