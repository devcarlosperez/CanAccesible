module.exports = (app) => {
  const { verifyAdmin } = require("../../middlewares/auth.middleware");
  const router = require("express").Router();

  // Apply verifyAdmin middleware to all routes in this router
  router.use(verifyAdmin);

  // Import all dashboard routes
  require("./index.routes")(router);
  require("./blogArticles.routes")(router);
  require("./incidents.routes")(router);
  require("./users.routes")(router);
  require("./logs.routes")(router);
  require("./conversations.routes")(router);

  app.use("/dashboard-admin", router);
};
