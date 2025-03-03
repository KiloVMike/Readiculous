const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // FIXED

    if (!token) {
        return res.status(400).json({
            message: "Authentication token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Token expired or invalid"
            });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticationToken };
