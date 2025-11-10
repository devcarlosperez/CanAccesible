const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId, nameFile } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).send({ message: "Faltan datos obligatorios" });
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

    User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId,
      nameFile: nameFile || null,
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
exports.update = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, roleId, nameFile } = req.body;

  User.findByPk(id)
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      // If password is provided, hash it
      let hashedPassword = user.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      User.update(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roleId,
          nameFile,
        },
        { where: { id } }
      )
        .then(() => {
          return User.findByPk(id);
        })
        .then((updatedUser) => {
          res.send(updatedUser);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error al actualizar el usuario",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al buscar el usuario",
      });
    });
};

// Delete an user
exports.delete = (req, res) => {
  const { id } = req.params;

  User.destroy({ where: { id } })
    .then((deleted) => {
      if (deleted) {
        res.send({ message: "Usuario eliminado correctamente" });
      } else {
        res.status(404).send({ message: "Usuario no encontrado" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al eliminar el usuario",
      });
    });
};
