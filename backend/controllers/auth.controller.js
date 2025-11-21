const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = db.user;
const { jwtConfig } = require("../config/jwt");

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
