const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/doSpacesClient");

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).send({ message: "Faltan datos obligatorios" });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Image es obligatorio" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ message: "El email tiene un formato inválido" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameFile = req.file.location;

    User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId,
      nameFile,
    })
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error al crear el usuario",
        });
      });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).send({ message: "Error del servidor" });
  }
};

exports.findAll = (req, res) => {
  User.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "dateRegister",
      "roleId",
      "nameFile",
    ],
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al obtener usuarios",
      });
    });
};

// Get a single user by ID
exports.findOne = (req, res) => {
  const { id } = req.params;

  User.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "dateRegister",
      "roleId",
      "nameFile",
    ],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al obtener el usuario",
      });
    });
};

// Update an user
exports.update = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, roleId } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const userToUpdate = {};

    // Update fields only if they are provided
    if (firstName !== undefined) {
      userToUpdate.firstName = firstName;
    }
    if (lastName !== undefined) {
      userToUpdate.lastName = lastName;
    }
    if (email !== undefined) {
      userToUpdate.email = email;
    }
    if (password) {
      userToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (roleId !== undefined) {
      userToUpdate.roleId = roleId;
    }

    // Handle image update if a new file is uploaded
    if (req.file) {
      // If there's an old image, delete it from DO Spaces
      if (user.nameFile) {
        const urlParts = user.nameFile.split('/');
        const oldKey = urlParts.slice(-2).join('/');

        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.DO_SPACE_NAME,
            Key: oldKey,
          }));
          console.log(`Imagen anterior eliminada del storage: ${oldKey}`);
        } catch (deleteErr) {
          console.error("Error eliminando la imagen anterior del storage:", deleteErr);
          // Continue with update even if old image deletion fails
        }
      }

      userToUpdate.nameFile = req.file.location;
    }

    await User.update(userToUpdate, { where: { id } });
    const updatedUser = await User.findByPk(id);
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al actualizar el usuario",
    });
  }
};

// Delete an user
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user to get the image file name
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // If there's an image, delete it from DO Spaces
    if (user.nameFile) {
      const urlParts = user.nameFile.split('/');
      const key = urlParts.slice(-2).join('/'); // Get the last two parts

      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.DO_SPACE_NAME,
          Key: key,
        }));
        console.log(`Imagen eliminada del storage: ${key}`);
      } catch (deleteErr) {
        console.error("Error eliminando la imagen del storage:", deleteErr);
        // Continue with record deletion even if image deletion fails
      }
    }

    // Delete the user record
    await User.destroy({ where: { id } });
    res.send({
      message: "Usuario y su imagen asociada han sido eliminados correctamente.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error al eliminar el usuario",
    });
  }
};
