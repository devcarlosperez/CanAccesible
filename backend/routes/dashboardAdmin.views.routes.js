module.exports = (app) => {
  const { verifyAdmin } = require("../middlewares/auth.middleware");
  const db = require("../models");

  const router = require("express").Router();

  // Dashboard admin page - only admins can access
  router.get("/", verifyAdmin, async (req, res) => {
    try {
      // Get counts from database
      const articleCount = await db.blogArticle.count();
      const incidentCount = await db.incident.count();
      const conversationCount = await db.conversation.count();
      const logCount = await db.log.count();
      const userCount = await db.user.count();

      // Get approved and not approved incidents
      const approvedIncidents = await db.incident.count({ where: { isApproved: true } });
      const notApprovedIncidents = await db.incident.count({ where: { isApproved: false } });

      // Get user roles distribution using associations
      const adminCount = await db.user.count({
        include: [{
          model: db.role,
          as: 'role',
          where: { role: 'admin' }
        }]
      });

      const userNormalCount = await db.user.count({
        include: [{
          model: db.role,
          as: 'role',
          where: { role: 'usuario' }
        }]
      });

      const municipioCount = await db.user.count({
        include: [{
          model: db.role,
          as: 'role',
          where: { role: 'municipio' }
        }]
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
          users: userCount
        },
        chartData: {
          approvedIncidents,
          notApprovedIncidents,
          adminCount,
          userNormalCount,
          municipioCount
        }
      });
    } catch (error) {
      console.error("Error loading dashboard counts:", error);
      res.render("admin/dashboard/index", {
        user: req.user,
        title: "Dashboard Administrador",
        frontendUrl: process.env.FRONTEND_URL,
        counts: {
          articles: 0,
          incidents: 0,
          conversations: 0,
          logs: 0,
          users: 0
        },
        chartData: {
          approvedIncidents: 0,
          notApprovedIncidents: 0,
          adminCount: 0,
          userNormalCount: 0,
          municipioCount: 0
        }
      });
    }
  });

  app.use("/dashboard-admin", router);
};
