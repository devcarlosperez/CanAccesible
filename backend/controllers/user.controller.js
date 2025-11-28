const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const { deleteImageFromStorage } = require("../config/doSpacesClient");
const transporter = require("../config/mailer");
const { createLog } = require("../services/log.service");

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email format is invalid" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
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

    const actorId = req.user ? req.user.id : newUser.id;
    await createLog(actorId, "Create User", "User", newUser.id);

    await transporter.sendMail({
      from: `"CANACCESIBLE" <${process.env.SMTP_USER}>`,
      to: newUser.email,
      subject: "¡Bienvenido/a a CANACCESIBLE! 😎🔥",
      html: `
    <h2>Hola ${newUser.firstName}!</h2>
    <p>Tu cuenta ha sido creada con éxito.</p>
    <p>Ya puedes iniciar sesión y disfrutar de la plataforma brooo 😎</p>
  `,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating the user" });
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
      attributes: ["firstName", "lastName", "nameFile"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching user" });
  }
};

exports.findAllAdmins = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }

    const admins = await User.findAll({
      where: { roleId: 2 },
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

    res.status(200).json(admins);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching admin users" });
  }
};

exports.findAllUsers = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }

    const normalUsers = await User.findAll({
      where: { roleId: 1 },
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

    res.status(200).json(normalUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching normal users" });
  }
};

exports.findAllMunicipalities = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }

    const municipalities = await User.findAll({
      where: { roleId: 3 },
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

    res.status(200).json(municipalities);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching municipalities" });
  }
};

exports.findTopReportingUsers = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }

    const topUsers = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "dateRegister",
        "roleId",
        "nameFile",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("incidents.id")),
          "incidenceCount",
        ],
      ],
      include: [
        {
          model: db.incident,
          as: "incidents",
          attributes: [],
          required: false,
        },
      ],
      group: ["User.id"],
      raw: true,
      subQuery: false,
      order: [
        [db.sequelize.fn("COUNT", db.sequelize.col("incidents.id")), "DESC"],
      ],
    });

    res.status(200).json(topUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching top reporting users" });
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
        .json({ message: "You do not have permission to perform this action" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userToUpdate = {};

    if (firstName !== undefined) {
      if (firstName.trim() === "") {
        return res.status(400).json({ message: "First name cannot be empty" });
      }
      userToUpdate.firstName = firstName;
    }

    if (lastName !== undefined) {
      if (lastName.trim() === "") {
        return res.status(400).json({ message: "Last name cannot be empty" });
      }
      userToUpdate.lastName = lastName;
    }

    if (email !== undefined) {
      if (email.trim() === "") {
        return res.status(400).json({ message: "Email cannot be empty" });
      }
      userToUpdate.email = email;
    }

    if (password) {
      if (password.trim() === "") {
        return res.status(400).json({ message: "Password cannot be empty" });
      }
      userToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Only an admin can update the roleId field
    if (roleId !== undefined && req.user.roleId === 2) {
      userToUpdate.roleId = roleId;
    }

    if (req.file) {
      if (user.nameFile) {
        await deleteImageFromStorage(user.nameFile);
      }
      userToUpdate.nameFile = req.file.location;
    }

    await User.update(userToUpdate, { where: { id } });
    const updatedUser = await User.findByPk(id);

    await createLog(req.user.id, "Update User", "User", id);

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating the user" });
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
    // Delete the user from the database
    await User.destroy({ where: { id } });

    await createLog(req.user.id, "Delete User", "User", id);

    res.status(200).json({
      message: "User and associated image have been deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting user" });
  }
};
