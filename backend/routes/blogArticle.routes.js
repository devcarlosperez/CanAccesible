module.exports = (app) => {
  const blogArticle = require("../controllers/blogArticle.controller");
  const blogArticleImageUpload = require("../middlewares/blogArticleImageUpload");
  const { verifySession } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post(
    "/",
    verifySession,
    blogArticleImageUpload.single("image"),
    blogArticle.create
  );

  router.get("/", blogArticle.findAll);

  router.get("/:id", blogArticle.findOne);

  router.put(
    "/:id",
    verifySession,
    blogArticleImageUpload.single("image"),
    blogArticle.update
  );

  router.delete("/:id", verifySession, blogArticle.delete);

  app.use("/api/blogArticles", router);
};
