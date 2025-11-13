const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/doSpacesClient");

// Utility function to delete image from DO Spaces
async function deleteImageFromStorage(nameFile) {
  if (!nameFile) return;
  try {
    const urlParts = nameFile.split('/');
    const key = urlParts.slice(-2).join('/');
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_NAME,
      Key: key,
    }));
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

    if (!req.file) {
      return res.status(400).json({ message: "Image es obligatorio" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El email tiene un formato inválido" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameFile = req.file.location;

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
    res.status(500).json({ message: err.message || "Error al crear el usuario" });
  }
};

exports.findAll = async (req, res) => {
  try {
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
    res.status(500).json({ message: err.message || "Error al obtener usuarios" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
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
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener el usuario" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, roleId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userToUpdate = {};

    if (firstName !== undefined) userToUpdate.firstName = firstName;
    if (lastName !== undefined) userToUpdate.lastName = lastName;
    if (email !== undefined) userToUpdate.email = email;
    if (password) userToUpdate.password = await bcrypt.hash(password, 10);
    if (roleId !== undefined) userToUpdate.roleId = roleId;

    if (req.file) {
      await deleteImageFromStorage(user.nameFile);
      userToUpdate.nameFile = req.file.location;
    }

    await User.update(userToUpdate, { where: { id } });
    const updatedUser = await User.findByPk(id);

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al actualizar el usuario" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await deleteImageFromStorage(user.nameFile);
    await User.destroy({ where: { id } });

    res.status(200).json({ message: "Usuario y su imagen asociada han sido eliminados correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al eliminar el usuario" });
  }
};
