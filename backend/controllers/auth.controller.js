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
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
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

    res.status(200).json({
      message: "Successful login",
      user: {
        id: user.id,
        nombre: user.firstName,
        email: user.email,
        role: user.role.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Session closed successfully" });
  });
};
