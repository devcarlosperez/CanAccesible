module.exports = (router) => {
  const logsController = require("../../controllers/dashboard-admin/logs.controller");

  // Logs Management Page
  router.get("/logs", logsController.getLogs);
};

