const db = require("../models");
const BlogArticle = db.blogArticle;

// Create a blog article
exports.create = async (req, res) => {
  try {
    const { title, description, content, dateCreation } = req.body;

    // Validate required fields
    if (!title)
      return res.status(400).json({ message: "title es obligatorio" });
    if (!description)
      return res.status(400).json({ message: "description es obligatorio" });
    if (!content)
      return res.status(400).json({ message: "content es obligatorio" });
    if (!dateCreation)
      return res.status(400).json({ message: "dateCreation es obligatorio" });
    if (!req.file)
      return res.status(400).json({ message: "Image es obligatorio" });

    const nameFile = req.file.location;

    const newArticle = await BlogArticle.create({
      title,
      description,
      content,
      dateCreation,
      nameFile,
    });

    res.status(201).json(newArticle);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error creando el artículo del blog" });
  }
};

// Retrieve all notifications
exports.findAll = async (req, res) => {
  try {
    const articles = await BlogArticle.findAll();
    res.status(200).json(articles);
  } catch (err) {
    res
      .status(500)
      .json({
        message: err.message || "Error leyendo los artículos del blog.",
      });
  }
};

// Retrieve one notification by ID
exports.findOne = async (req, res) => {
  try {
    const article = await BlogArticle.findOne({ where: { id: req.params.id } });
    if (!article)
      return res
        .status(404)
        .json({ message: "Artículo de blog no encontrado." });
    res.status(200).json(article);
  } catch (err) {
    res
      .status(500)
      .json({
        message: err.message || "Error encontrando el artículo del blog.",
      });
  }
};

// Update a blog article
exports.update = async (req, res) => {
  const articleToUpdate = {};
  const articleId = req.params.id;

  // Update fields only if they are provided
  if (req.body.title !== undefined) {
    articleToUpdate.title = req.body.title;
  }
  if (req.body.description !== undefined) {
    articleToUpdate.description = req.body.description;
  }
  if (req.body.content !== undefined) {
    articleToUpdate.content = req.body.content;
  }
  if (req.body.dateCreation !== undefined && req.body.dateCreation !== null && req.body.dateCreation !== '') {
    // Validate date format
    const dateValue = new Date(req.body.dateCreation);
    if (isNaN(dateValue.getTime())) {
      return res.status(400).json({ message: "dateCreation debe ser una fecha válida" });
    }
    articleToUpdate.dateCreation = req.body.dateCreation;
  }

  // Handle image update if a new file is uploaded
  if (req.file) {
    articleToUpdate.nameFile = req.file.location;
  }

  try {
    const [updated] = await BlogArticle.update(articleToUpdate, {
      where: { id: articleId },
    });

    if (updated) {
      const updatedArticle = await BlogArticle.findOne({
        where: { id: articleId },
      });
      return res.status(200).json(updatedArticle);
    }

    res.status(404).json({ message: "Artículo del blog no encontrado." });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Algún error ocurrió mientras se actualizaba el artículo.",
    });
  }
};

// Delete a blog article
exports.delete = async (req, res) => {
  const id = req.params.id;

  BlogArticle.destroy({ where: { id } })
    .then((deleted) => {
      if (deleted) {
        res.send({ message: "El artículo del blog ha sido eliminado." });
      } else {
        res.status(404).send({ message: "Artículo del blog no encontrado." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: err.message || "Error borrando el artículo del blog.",
        });
    });
};
