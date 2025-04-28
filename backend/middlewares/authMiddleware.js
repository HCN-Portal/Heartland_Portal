const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Please log in first' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
};
