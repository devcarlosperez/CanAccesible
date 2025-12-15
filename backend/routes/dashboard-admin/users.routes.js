module.exports = (router) => {
  const usersController = require("../../controllers/dashboard-admin/users.controller");

  // Users Management Page
  router.get("/users", usersController.getUsers);
};

