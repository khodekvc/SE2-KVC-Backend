    const jwt = require("jsonwebtoken");

    const authenticate = (req, res, next) => {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "❌ Server error. Missing JWT_SECRET." });
        }

        const token = req.cookies?.token; 

        if (!token) {
            return res.status(401).json({ error: "❌ Unauthorized: No token provided." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ error: "❌ Unauthorized: Token expired. Please log in again." });
                }
                return res.status(401).json({ error: "❌ Unauthorized: Invalid token." });
            }
            
            req.user = decoded;
            next();
        });
    };

    const authorize = ({ roles = [], userIdParam = "" }) => {
        return (req, res, next) => {
            const user = req.user;
            
            if (!user) {
                return res.status(401).json({ error: "❌ Unauthorized: No user found." });
            }

            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ error: "❌ Forbidden: You do not have the required role." });
            }

            next();
        };
    };

    module.exports = { authenticate, authorize };