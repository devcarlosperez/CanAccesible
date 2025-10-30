const db = require("../models");
const User = db.User; // Asegúrate de que coincide con el nombre del modelo
const bcrypt = require("bcryptjs"); // para hashear passwords

// Crear un nuevo usuario
exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, rol } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
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

// Obtener todos los usuarios
exports.getAll = async (res) => {
  try {
    const users = await User.findAll({
      include: [
        { association: "incidences" },
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

// Obtener un usuario por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        { association: "incidences" },
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

// Actualizar un usuario
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, rol } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Si hay password, hashéalo
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

// Eliminar un usuario
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
