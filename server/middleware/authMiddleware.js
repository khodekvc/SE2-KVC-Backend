const jwt = require("jsonwebtoken");

/**
 * Middleware to check if the user is authenticated via JWT token.
 */
const authenticate = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "❌ Server error. Missing JWT_SECRET." });
    }

    const authHeader = req.headers.authorization;

    // Log the Authorization header to check if the token is being passed
    console.log('Authorization Header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "❌ Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "❌ Unauthorized: Invalid token." });
        }
        console.log('Decoded Token:', decoded);
        req.user = decoded; // Attach decoded user data (including role) to request
        next();
    });
};

/**
 * Middleware to verify if the user has the required role(s).
 */
const authorize = ({ roles = [], userIdParam = "" }) => {
    return (req, res, next) => {
        const user = req.user;
        
        // Check if the user is authenticated (we assume `req.user` is set after authentication)
        if (!user) {
            return res.status(401).json({ error: "❌ Unauthorized: No user found." });
        }

        // Role-based authorization
        if (roles.length > 0 && !roles.includes(user.role)) {
            return res.status(403).json({ error: "❌ Forbidden: You do not have the required role." });
        }

        next();
    };
};

module.exports = { authenticate, authorize };