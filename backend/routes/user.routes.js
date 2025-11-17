module.exports = (app) => {
  const user = require("../controllers/user.controller");
  const userImageUpload = require("../middlewares/userImageUpload");

  const router = require("express").Router();

  router.post("/", userImageUpload.single("image"), user.create);

  router.get("/", user.findAll);

  router.get("/:id", user.findOne);

  router.put("/:id", userImageUpload.single("image"), user.update);

  router.delete("/:id", user.delete);

  app.use("/api/users", router);
};
