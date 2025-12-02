module.exports = (router) => {
  const db = require("../../models");

  // Incidents Management Page
  router.get("/incidents", async (req, res) => {
    try {
      const incidents = await db.incident.findAll({
        order: [["dateIncident", "DESC"]],
      });

      res.render("admin/dashboard/incidents/index", {
        user: req.user,
        title: "Gestión de Incidencias - CanAccesible",
        frontendUrl: process.env.FRONTEND_URL,
        incidents: incidents,
      });
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).send("Error fetching incidents");
    }
  });
};
