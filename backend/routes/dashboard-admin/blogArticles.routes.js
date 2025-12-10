module.exports = (router) => {
  const blogArticlesController = require("../../controllers/dashboard-admin/blogArticles.controller");

  // Blog Articles Management Page
  router.get("/blog-articles", blogArticlesController.getBlogArticles);
};

