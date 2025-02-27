const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "❌ Unauthorized. Please log in." });
    }
    next();
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).json({ error: "❌ Forbidden. Access denied." });
        }
        next();
    };
};

module.exports = { authenticate, authorize };


exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Unauthorized: Invalid token" });
        }

        req.user = decoded;
        next();
    });
};
