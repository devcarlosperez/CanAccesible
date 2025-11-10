module.exports = {
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: 60 * 60 * 24, // 1 day
  },
};
