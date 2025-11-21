const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/doSpacesClient");

// Utility function to delete image from DO Spaces
async function deleteImageFromStorage(nameFile) {
  if (!nameFile) return;
  try {
    const urlParts = nameFile.split("/");
    const key = urlParts.slice(-2).join("/");
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACE_NAME,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Error eliminando imagen del storage:", err.message);
  }
}

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
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
    const nameFile = req.file ? req.file.location : null;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId,
      nameFile,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error al crear el usuario" });
  }
};

exports.findAll = async (req, res) => {
  try {
    // Only admins can access all users
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }

    const users = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "dateRegister",
        "roleId",
        "nameFile",
      ],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching users" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow user to fetch only their own data, unless they are admin
    if (req.user.id !== parseInt(id) && req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this user" });
    }

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "dateRegister",
        "roleId",
        "nameFile",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching user" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, roleId } = req.body;

    // Check if the authenticated user is trying to edit their own profile
    if (req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para realizar esta acción" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userToUpdate = {};

    if (firstName !== undefined) userToUpdate.firstName = firstName;
    if (lastName !== undefined) userToUpdate.lastName = lastName;
    if (email !== undefined) userToUpdate.email = email;
    if (password) userToUpdate.password = await bcrypt.hash(password, 10);

    // Only an admin can update the roleId field
    if (roleId !== undefined && req.user.roleId === 2) {
      userToUpdate.roleId = roleId;
    }

    if (req.file) {
      await deleteImageFromStorage(user.nameFile);
      userToUpdate.nameFile = req.file.location;
    }

    await User.update(userToUpdate, { where: { id } });
    const updatedUser = await User.findByPk(id);

    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error al actualizar el usuario" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is either deleting their own account or is an admin
    if (req.user.id !== parseInt(id) && req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to perform this action" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete profile image from storage
    await deleteImageFromStorage(user.nameFile);

    // Delete the user from the database
    await User.destroy({ where: { id } });

    res.status(200).json({
      message: "User and associated image have been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting user" });
  }
};
