module.exports = (app) => {
  const user = require("../controllers/user.controller");
  const userImageUpload = require("../middlewares/userImageUpload");
  const { verifyTokenOrSession } = require("../middlewares/auth.middleware");

  const router = require("express").Router();

  router.post("/", userImageUpload.single("image"), user.create);

  router.get("/", verifyTokenOrSession, user.findAll);

  router.get("/user", verifyTokenOrSession, user.findAllUsers);

  router.get("/admin", verifyTokenOrSession, user.findAllAdmins);

  router.get(
    "/top-reporting",
    verifyTokenOrSession,
    user.findTopReportingUsers
  );

  router.get("/:id", verifyTokenOrSession, user.findOne);

  router.put(
    "/:id",
    verifyTokenOrSession,
    userImageUpload.single("image"),
    user.update
  );

  router.delete("/:id", verifyTokenOrSession, user.delete);

  app.use("/api/users", router);
};
