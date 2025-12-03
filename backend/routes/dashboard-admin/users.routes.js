module.exports = (router) => {
  // Users Management Page
  router.get("/users", (req, res) => {
    res.render("admin/dashboard/users/index", {
      user: req.user,
      title: "Gestión de Usuarios - CanAccesible",
      frontendUrl: process.env.FRONTEND_URL,
    });
  });
};
