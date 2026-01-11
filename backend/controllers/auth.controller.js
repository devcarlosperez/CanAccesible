const db = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const userService = require("../services/user.service");
const User = db.user;
const Notification = db.notification;
const { jwtConfig } = require("../config/jwt");
const resend = require("../config/resend");
const { createLog } = require("../services/log.service");

exports.signIn = async (req, res) => {
  try {
    let email, password;
    const authHeader = req.headers.authorization;

    // 1. Try Basic Auth Header
    if (authHeader && authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.split(" ")[1];
      const decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
      [email, password] = decoded.split(":");
    }
    // 2. Try Request Body (JSON or URL-encoded)
    else if (req.body.email && req.body.password) {
      email = req.body.email;
      password = req.body.password;
    } else {
      return res.status(400).json({
        message:
          "Missing credentials. Please provide Basic Auth header or email/password in body.",
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: db.role, as: "role" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ldapResult = await userService.authenticate(email, password);

    if (!ldapResult) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        role: user.role.role,
        nameFile: user.nameFile,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role.role;
    req.session.firstName = user.firstName;
    req.session.lastName = user.lastName;

    await Notification.create({
      userId: user.id,
      entity: "User",
      entityId: user.id,
      message: "Login detected on your account",
      dateNotification: new Date(),
    });

    await createLog(user.id, "LOGIN", "User", user.id);

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

    setImmediate(async () => {
      try {
        const { data, error } = await resend.emails.send({
          from: "noreply@canaccesible.es",
          to: [user.email],
          subject: "Inicio de sesión detectado",
          html: `
            <h2>Hola ${user.firstName},</h2>
            <p>
              Hemos detectado un inicio de sesión reciente en tu cuenta.
            </p>
            <p>
              Si has sido tú, no es necesario que realices ninguna acción.
            </p>
            <p>
              Si no reconoces este inicio de sesión, te recomendamos cambiar tu contraseña de inmediato y revisar la seguridad de tu cuenta.
            </p>
            <p>
              Si necesitas ayuda, contacta con nuestro equipo de soporte.
            </p>
          `,
        });

        if (error) {
          console.error("[MAIL] Resend error:", error);
        } else {
          console.log("[MAIL] Email sent successfully:", data);
        }
      } catch (emailError) {
        console.error("[MAIL] Send error:", emailError);
      }
    });
  } catch (error) {
    console.error("[AUTH] SignIn error:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      error.message.includes("Invalid password") ||
      error.message.includes("Invalid credentials")
    ) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  if (req.session && req.session.userId) {
    await createLog(req.session.userId, "LOGOUT", "User", req.session.userId);
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Session closed successfully" });
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save to DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const { error } = await resend.emails.send({
      from: "CANACCESIBLE <onboarding@resend.dev>",
      to: [user.email],
      subject: "Recuperación de contraseña",
      html: `
        <h2>Hola ${user.firstName},</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ message: "Error sending email" });
    }

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
      include: [{ model: db.role, as: "role" }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
      });
    }

    await userService.resetPassword(user.email, newPassword);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await createLog(user.id, "PASSWORD_RESET", "User", user.id);

    setImmediate(async () => {
      try {
        await resend.emails.send({
          from: "noreply@canaccesible.es",
          to: [user.email],
          subject: "Contraseña actualizada",
          html: `
            <h2>Hola ${user.firstName},</h2>
            <p>Tu contraseña ha sido restablecida correctamente.</p>
            <p>Si no has realizado esta acción, por favor contacta con soporte inmediatamente.</p>
          `,
        });
      } catch (error) {
        console.error("[MAIL] Error sending reset confirmation:", error);
      }
    });

    res.status(200).json({ message: "Password has been updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From verifyToken middleware

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await userService.authenticate(user.email, currentPassword);
    } catch (error) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    await userService.resetPassword(user.email, newPassword);

    await createLog(userId, "PASSWORD_CHANGE", "User", userId);

    setImmediate(async () => {
      try {
        await resend.emails.send({
          from: "noreply@canaccesible.es",
          to: [user.email],
          subject: "Contraseña actualizada",
          html: `
            <h2>Hola ${user.firstName},</h2>
            <p>Tu contraseña ha sido actualizada desde tu perfil.</p>
            <p>Si no has realizado esta acción, por favor contacta con soporte inmediatamente.</p>
          `,
        });
      } catch (error) {
        console.error("[MAIL] Error sending change confirmation:", error);
      }
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
