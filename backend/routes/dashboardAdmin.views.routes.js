module.exports = (app) => {
  const { verifyAdmin } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  // Dashboard admin page - only admins can access
  router.get("/", verifyAdmin, (req, res) => {
    res.render("admin/dashboard/index", {});
  });

  app.use("/dashboard-admin", router);
};
