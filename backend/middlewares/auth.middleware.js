const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/jwt");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remove "Bearer "
  }

  if (!token) {
    return res.status(403).json({ message: "Token not provided." });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
    req.user = decoded;
    next();
  });
};

const verifySession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(403).json({ message: "Session not provided." });
  }

  req.user = {
    id: req.session.userId,
    email: req.session.email,
    role: req.session.role,
  };
  next();
};

const verifyAdmin = async (req, res, next) => {
  // First verify session exists
  if (!req.session || !req.session.userId) {
    return res.redirect("/home");
  }

  // Then verify user is admin
  if (req.session.role !== "admin") {
    return res.status(403).render("error", {
      message:
        "No tienes permisos para acceder a esta página. Solo los administradores pueden acceder.",
      statusCode: 403,
    });
  }

  // Get fresh user data from database to ensure firstName and lastName are up-to-date
  try {
    const db = require("../models");
    const user = await db.user.findByPk(req.session.userId);

    if (!user) {
      return res.redirect("/home");
    }

    // Set user info in req for use in controllers - use fresh data from DB
    req.user = {
      id: req.session.userId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error("Error fetching user data in verifyAdmin:", error);
    // Fallback to session data if database query fails
    req.user = {
      id: req.session.userId,
      email: req.session.email,
      role: req.session.role,
      firstName: req.session.firstName,
      lastName: req.session.lastName,
    };
  }

  next();
};

// Hybrid auth: accept Bearer token or fallback to session
const verifyTokenOrSession = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    return verifyToken(req, res, next);
  }

  if (req.session && req.session.userId) {
    try {
      const db = require("../models");
      const user = await db.user.findByPk(req.session.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
          role: req.session.role,
        };
        return next();
      }
    } catch (error) {
      console.error("Error verifying session user:", error);
    }
  }

  return res
    .status(403)
    .json({ message: "Access denied. No token or session provided." });
};

module.exports = {
  verifyToken,
  verifySession,
  verifyAdmin,
  verifyTokenOrSession,
};
