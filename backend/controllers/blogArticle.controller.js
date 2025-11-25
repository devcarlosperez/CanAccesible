const db = require("../models");
const { deleteImageFromStorage } = require("../config/doSpacesClient");
const { verifySession } = require("../middlewares/auth.middleware");
const { createLog } = require("../services/log.service");
const BlogArticle = db.blogArticle;

// Create a blog article
exports.create = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to create blog articles." });
    }

    const { title, description, content, dateCreation } = req.body;

    if (!title)
      return res.status(400).json({ message: "title is required" });
    if (!description)
      return res.status(400).json({ message: "description is required" });
    if (!content)
      return res.status(400).json({ message: "content is required" });
    if (!dateCreation)
      return res.status(400).json({ message: "dateCreation is required" });
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const nameFile = req.file.location;

    const newArticle = await BlogArticle.create({
      title,
      description,
      content,
      dateCreation,
      nameFile,
    });

    // Create log
    await createLog(req.user.id, 'CREATE', 'BlogArticle', newArticle.id);

    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error creating the blog article",
    });
  }
};

// Retrieve all blog articles
exports.findAll = async (req, res) => {
  try {
    const articles = await BlogArticle.findAll({
      order: [['dateCreation', 'ASC']]
    });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error retrieving blog articles.",
    });
  }
};

// Retrieve one blog article by ID
exports.findOne = async (req, res) => {
  try {
    const article = await BlogArticle.findOne({ where: { id: req.params.id } });
    if (!article)
      return res.status(404).json({ message: "Blog article not found." });

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error finding the blog article.",
    });
  }
};

// Update a blog article
exports.update = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to update blog articles." });
    }

    const articleToUpdate = {};
    const articleId = req.params.id;

    if (req.body.title !== undefined) articleToUpdate.title = req.body.title;
    if (req.body.description !== undefined) articleToUpdate.description = req.body.description;
    if (req.body.content !== undefined) articleToUpdate.content = req.body.content;

    if (req.body.dateCreation !== undefined && req.body.dateCreation !== null && req.body.dateCreation !== '') {
      const dateValue = new Date(req.body.dateCreation);
      if (isNaN(dateValue.getTime())) {
        return res.status(400).json({ message: "dateCreation must be a valid date" });
      }
      articleToUpdate.dateCreation = req.body.dateCreation;
    }

    if (req.file) {
      const oldArticle = await BlogArticle.findOne({ where: { id: articleId } });
      if (oldArticle) await deleteImageFromStorage(oldArticle.nameFile);
      articleToUpdate.nameFile = req.file.location;
    }

    const [updated] = await BlogArticle.update(articleToUpdate, {
      where: { id: articleId },
    });

    if (updated) {
      const updatedArticle = await BlogArticle.findOne({
        where: { id: articleId },
      });
      // Create log
      await createLog(req.user.id, 'UPDATE', 'BlogArticle', articleId);
      return res.status(200).json(updatedArticle);
    }

    res.status(404).json({ message: "Blog article not found." });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "An error occurred while updating the blog article.",
    });
  }
};

// Delete a blog article
exports.delete = async (req, res) => {
  try {
    // Verify that user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "You do not have permission to delete blog articles." });
    }

    const id = req.params.id;
    const article = await BlogArticle.findOne({ where: { id } });

    if (!article) {
      return res.status(404).json({ message: "Blog article not found." });
    }

    await deleteImageFromStorage(article.nameFile);
    await BlogArticle.destroy({ where: { id } });

    // Create log
    await createLog(req.user.id, 'DELETE', 'BlogArticle', id);

    res.status(200).json({
      message: "Blog article and its associated image have been deleted.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error deleting the blog article.",
    });
  }
};
