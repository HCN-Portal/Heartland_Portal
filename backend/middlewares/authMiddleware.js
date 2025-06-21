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

module.exports.isAuthUser = (req, res, next) => {
    // Allow access if user is requesting their own info or is an admin
    if (req.userId === req.params.id || req.role === 'admin') {
        console.log("Access granted:", req.role === 'admin' ? "Admin access" : "Own account access");
        return next();
    }
    
    console.log("Access denied: Not own account and not admin");
    return res.status(403).json({ error: 'Access denied. You can only access your own information.' });
};

module.exports.isAdminOrManager = (req, res, next) => {
  // Check if the user is a manager
  if (req.role === 'admin' || req.role === 'manager') {
      return next();
  }
  return res.status(403).json({ error: 'Access denied. Manager privileges required.' });
};

module.exports.isManager = (req, res, next) => {
  if (req.role === 'manager') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Manager privileges required.' });
};

module.exports.isEmployee = (req, res, next) => {
  if (req.role === 'employee') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Employee privileges required.' });
};
