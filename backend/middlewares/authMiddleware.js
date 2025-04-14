const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization") || ""
    const authHeaderParts = authHeader.split(" ")
    const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null
    //const { accessToken } = req.cookies;
    console.log('Access Token:', token); // Log the access token for debugging
    if (!token) {
        return res.status(401).json({ error: 'Please log in first' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.role = decodedToken.role;
        req.userId = decodedToken.userId;
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports.isAdmin = (req, res, next) => {
    // This middleware should be used after authMiddleware
    if (req.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
};