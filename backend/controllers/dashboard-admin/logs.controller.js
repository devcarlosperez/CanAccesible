exports.getLogs = (req, res) => {
  res.render("admin/dashboard/logs/index", {
    user: req.user,
    title: "Registro de Actividad - CanAccesible",
    frontendUrl: process.env.FRONTEND_URL,
  });
};
