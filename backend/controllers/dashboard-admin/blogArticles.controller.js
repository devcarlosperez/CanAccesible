const db = require("../../models");

exports.getBlogArticles = async (req, res) => {
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
};
