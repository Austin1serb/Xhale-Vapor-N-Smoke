const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;


function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.customerId = decoded.customerId;
        next();
    });
}
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next(); // User is admin, proceed to the next middleware
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};


module.exports = { verifyToken, isAdmin };
