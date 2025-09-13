const { verifyToken } = require("../../config/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer "))
    return res.status(401).json({ error : "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token error" });
  
  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error : "Invalid token" });
  }
}

module.exports = authMiddleware;
