const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Token not provided.' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};

const verifySession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(403).json({ message: 'Session not provided.' });
  }

  req.user = {
    id: req.session.userId,
    email: req.session.email,
    role: req.session.role
  };
  next();
};

const verifyAdmin = (req, res, next) => {
  // First verify session exists
  if (!req.session || !req.session.userId) {
    return res.redirect('/home');
  }

  // Then verify user is admin
  if (req.session.role !== 'admin') {
    return res.status(403).render('error', {
      message: 'No tienes permisos para acceder a esta página. Solo los administradores pueden acceder.',
      statusCode: 403
    });
  }

  // Set user info in req for use in controllers
  req.user = {
    id: req.session.userId,
    email: req.session.email,
    role: req.session.role,
    firstName: req.session.firstName,
    lastName: req.session.lastName
  };

  next();
};

module.exports = { verifyToken, verifySession, verifyAdmin };