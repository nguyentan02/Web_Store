const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        jwt.verify(token, 'jwttoken', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            } else {
                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                req.user = user;
                next();
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateToken;
