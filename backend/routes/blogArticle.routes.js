module.exports = (app) => {
  const blogArticle = require("../controllers/blogArticle.controller");

  const router = require("express").Router();

  router.post("/", blogArticle.create);

  router.get("/", blogArticle.findAll);

  router.get("/:id", blogArticle.findOne);

  router.put("/:id", blogArticle.update);

  router.delete("/:id", blogArticle.delete);

  app.use("/api/blogArticles", router);
};