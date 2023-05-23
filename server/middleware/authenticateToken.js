const jwt = require("jsonwebtoken");

require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.header["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.status(401).json({ status: "Error", message: "there exist no token" });

    jwt.verify(token, process.env.SECRET_KEY_ACCESS, (err, user) => {
        if (err) return res.status(401).json({ status: "Error", message: "Invalid Token" });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;