const RevokedToken = require('../models/revokedToken.model');

const checkTokenRevocation = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        const revokedToken = await RevokedToken.findOne({ token: refreshToken });

        if (revokedToken) {
            return res.status(401).json({ message: 'Refresh token is revoked' });
        }

        next(); // If the token is not revoked, proceed to the next middleware or route
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error });
    }
};

module.exports = checkTokenRevocation;
