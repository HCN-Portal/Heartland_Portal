const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(401).json({ error: 'Please log in first' });
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        
        req.role = decodedToken.role;
        req.userId = decodedToken.userId;
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
