module.exports = (app) => {
  const user = require("../controllers/user.controller");
  const userImageUpload = require("../middlewares/userImageUpload");
  const { verifyToken } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", userImageUpload.single("image"), user.create);

  router.get("/", verifyToken, user.findAll);

  router.get("/:id", verifyToken, user.findOne);

  router.put("/:id", verifyToken, userImageUpload.single("image"), user.update);

  router.delete("/:id", verifyToken, user.delete);

  app.use("/api/users", router);
};
