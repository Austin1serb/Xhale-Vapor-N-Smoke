const jwt = require('jsonwebtoken');
const Customers = require('./models/customers.model')
const secretKey = process.env.JWT_SECRET_KEY;




function verifyToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    jwt.verify(refreshToken, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Find the user based on customerId in the token
        try {
            const user = await Customers.findById(decoded.customerId);
            if (user) {
                req.user = user; // Set the user object in the request
                return next();
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    });
}

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next(); // User is admin, proceed to the next middleware
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};





module.exports = { verifyToken, isAdmin };
