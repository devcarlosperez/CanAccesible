module.exports = (app) => {
  const conversations = require("../controllers/conversation.controller");

  const router = require("express").Router();

  router.post("/", conversations.create);

  router.get("/", conversations.findAll);

  router.get("/:id", conversations.findOne);

  router.put("/:id", conversations.update);

  router.delete("/:id", conversations.delete);

  app.use("/api/conversations", router);
};