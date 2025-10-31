const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, rol } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "El email tiene un formato inválido" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      rol: rol || "user",
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { association: "incidents" },
        { association: "comments" },
        { association: "likes" },
        { association: "multimedias" },
        { association: "notifications" },
        { association: "conversations" },
        { association: "messages" },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Get an user by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        { association: "incidents" },
        { association: "comments" },
        { association: "likes" },
        { association: "multimedias" },
        { association: "notifications" },
        { association: "conversations" },
        { association: "messages" },
      ],
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Update an user
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, rol } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // If exist password, hash it
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    await user.update({
      firstName,
      lastName,
      email,
      password: req.body.password,
      rol,
    });
    res.json(user);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Delete an user
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
