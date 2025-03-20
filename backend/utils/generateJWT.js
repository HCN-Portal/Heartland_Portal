const jwt = require('jsonwebtoken');

const generateJWT = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = generateJWT;
