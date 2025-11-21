module.exports = (app) => {
  const auth = require("../controllers/auth.controller");
  const router = require("express").Router();

  router.post("/signin", auth.signIn);
  router.post("/logout", auth.logout);
  app.use("/api/auth", router);
};
