module.exports = (app) => {
  const auth = require("../controllers/auth.controller");
  const { verifyToken } = require("../middlewares/auth.middleware");
  const router = require("express").Router();

  router.post("/signin", auth.signIn);
  router.post("/logout", auth.logout);
  router.post("/forgot-password", auth.forgotPassword);
  router.post("/reset-password", auth.resetPassword);
  router.post("/change-password", verifyToken, auth.changePassword);
  app.use("/api/auth", router);
};
