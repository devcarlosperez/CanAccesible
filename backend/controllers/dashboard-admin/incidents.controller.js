const db = require("../../models");

exports.getIncidents = async (req, res) => {
  try {
    const incidents = await db.incident.findAll({
      order: [["dateIncident", "DESC"]],
      include: [
        { model: db.incidentLike, as: "likes" },
        { model: db.incidentFollow, as: "followers" },
      ],
    });

    const topLiked = incidents
      .map(i => ({ name: i.name, count: (i.likes || []).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topFollowed = incidents
      .map(i => ({ name: i.name, count: (i.followers || []).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    console.log("Top Liked Data:", JSON.stringify(topLiked, null, 2));
    console.log("Top Followed Data:", JSON.stringify(topFollowed, null, 2));

    res.render("admin/dashboard/incidents/index", {
      user: req.user,
      title: "Gestión de Incidencias - CanAccesible",
      frontendUrl: process.env.FRONTEND_URL,
      incidents: incidents,
      topLiked,
      topFollowed
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).send("Error fetching incidents");
  }
};
