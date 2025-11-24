const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado.' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.user = decoded;
    next();
  });
};

const verifySession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(403).json({ message: 'Sesión no proporcionada.' });
  }

  req.user = req.session.user;
  next();
};

module.exports = { verifyToken, verifySession };