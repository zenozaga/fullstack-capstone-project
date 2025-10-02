const jwt = require("jsonwebtoken");
const logger = require("../logger");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function authMiddleware(req, res, next) {
  
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(401).json({ error: "Authorization header missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.error("Invalid token", err);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
