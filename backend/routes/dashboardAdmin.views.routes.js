module.exports = (app) => {
  const { verifyAdmin } = require("../middlewares/auth.middleware");
  const db = require("../models");
  const { Op } = require("sequelize");

  const router = require("express").Router();

  // Apply verifyAdmin middleware to all routes in this router
  router.use(verifyAdmin);

  // Dashboard admin page
  router.get("/", async (req, res) => {
    try {
      // Fetch counts from database
      const articleCount = await db.blogArticle.count();
      const incidentCount = await db.incident.count();
      const conversationCount = await db.conversation.count();
      const logCount = await db.log.count();
      const userCount = await db.user.count();

      // Fetch approved and not approved incidents
      const approvedIncidents = await db.incident.count({
        where: { isApproved: true },
      });
      const notApprovedIncidents = await db.incident.count({
        where: { isApproved: false },
      });

      // Fetch user roles distribution using associations
      const adminCount = await db.user.count({
        include: [
          {
            model: db.role,
            as: "role",
            where: { role: "admin" },
          },
        ],
      });

      const userNormalCount = await db.user.count({
        include: [
          {
            model: db.role,
            as: "role",
            where: { role: "usuario" },
          },
        ],
      });

      const municipioCount = await db.user.count({
        include: [
          {
            model: db.role,
            as: "role",
            where: { role: "municipio" },
          },
        ],
      });

      res.render("admin/dashboard/index", {
        user: req.user,
        title: "Dashboard Administrador",
        frontendUrl: process.env.FRONTEND_URL,
        counts: {
          articles: articleCount,
          incidents: incidentCount,
          conversations: conversationCount,
          logs: logCount,
          users: userCount,
          municipios: municipioCount,
        },
        chartData: {
          approvedIncidents,
          notApprovedIncidents,
          adminCount,
          userNormalCount,
          municipioCount,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.render("admin/dashboard/index", {
        user: req.user,
        title: "Dashboard Administrador",
        frontendUrl: process.env.FRONTEND_URL,
        counts: {
          articles: 0,
          incidents: 0,
          conversations: 0,
          logs: 0,
          users: 0,
          municipios: 0,
        },
        chartData: {
          approvedIncidents: 0,
          notApprovedIncidents: 0,
          adminCount: 0,
          userNormalCount: 0,
          municipioCount: 0,
        },
      });
    }
  });

  // Blog Articles Management Page
  router.get("/blog-articles", async (req, res) => {
    try {
      const articles = await db.blogArticle.findAll({
        order: [["dateCreation", "ASC"]],
      });

      res.render("admin/dashboard/blog-articles/index", {
        user: req.user,
        title: "Gestión de Artículos - CanAccesible",
        frontendUrl: process.env.FRONTEND_URL,
        articles: articles,
      });
    } catch (error) {
      console.error("Error fetching blog articles:", error);
      res.status(500).send("Error fetching blog articles");
    }
  });

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

  // Users Management Page
  router.get("/users", (req, res) => {
    res.render("admin/dashboard/users/index", {
      user: req.user,
      title: "Gestión de Usuarios - CanAccesible",
      frontendUrl: process.env.FRONTEND_URL,
    });
  });

  // Logs Management Page
  router.get("/logs", (req, res) => {
    res.render("admin/dashboard/logs/index", {
      user: req.user,
      title: "Registro de Actividad - CanAccesible",
      frontendUrl: process.env.FRONTEND_URL,
    });
  });

  app.use("/dashboard-admin", router);
};
