const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = db.user;
const Notification = db.notification;
const { jwtConfig } = require("../config/jwt");
const transporter = require("../config/mailer");

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: db.role, as: "role" }],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.role,
        roleId: user.roleId,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role.role;

    await Notification.create({
      userId: user.id,
      entity: "User",
      entityId: user.id,
      message: "Inicio de sesión detectado en tu cuenta",
      dateNotification: new Date(),
    });

    await transporter.sendMail({
      from: `"CANACCESIBLE" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Inicio de sesión detectado",
      html: `
        <h2>Hola ${user.firstName}!</h2>
        <p>Acabas de iniciar sesión en tu cuenta.</p>
        <p>Si fuiste tú: todo bajo control brooo 😎</p>
        <p>Si NO fuiste tú: cambia tu contraseña YA 🛑🔥</p>
      `,
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        nombre: user.firstName,
        email: user.email,
        role: user.role.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en signIn:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  });
};
