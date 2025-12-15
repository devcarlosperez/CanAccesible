module.exports = (app) => {
  const { verifyAdmin } = require("../../middlewares/auth.middleware");
  const overviewController = require("../../controllers/dashboard-admin/overview.controller");
  const router = require("express").Router();

  // Apply verifyAdmin middleware to all routes in this router
  router.use(verifyAdmin);

  // Dashboard admin main page
  router.get("/", overviewController.getDashboardData);

  // Import all dashboard routes
  require("./blogArticles.routes")(router);
  require("./incidents.routes")(router);
  require("./users.routes")(router);
  require("./logs.routes")(router);
  require("./conversations.routes")(router);

  app.use("/dashboard-admin", router);
};
