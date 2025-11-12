module.exports = (app) => {
  const blogArticle = require("../controllers/blogArticle.controller");
  const blogArticleImageUpload = require("../middleware/blogArticleImageUpload");

  const router = require("express").Router();

  router.post("/", blogArticleImageUpload.single("image") ,blogArticle.create);

  router.get("/", blogArticle.findAll);

  router.get("/:id", blogArticle.findOne);

  router.put("/:id", blogArticleImageUpload.single("image") ,blogArticle.update);

  router.delete("/:id", blogArticle.delete);

  app.use("/api/blogArticles", router);
};