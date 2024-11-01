const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    return res.status(500).json({ message: "Internal server error: Token secret not set" });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid authorization header" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "Token has expired, please login again." });
        }
        return res.status(403).json({ message: "The provided token is invalid." });
    }
}

module.exports = {
    authenticateToken
};
