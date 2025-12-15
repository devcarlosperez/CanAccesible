module.exports = (router) => {
  const incidentsController = require("../../controllers/dashboard-admin/incidents.controller");

  // Incidents Management Page
  router.get("/incidents", incidentsController.getIncidents);
};

