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
        }
      });
    }
  });

  app.use("/dashboard-admin", router);
};
