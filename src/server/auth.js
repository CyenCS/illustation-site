const jwt = require("jsonwebtoken");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.error('JWT_SECRET is not set. Set it in src/server/.env or environment variables.');

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("AuthHeader:", authHeader);
  console.log("Verifying token:", token);

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)  {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ success: false, message: `Invalid token: ${err.message}` });
    }
    
    // localStorage.setItem('token', token); // Store token in localStorage
    req.user = user; // attach decoded user info
    next();
  });
}

module.exports = verifyToken;
