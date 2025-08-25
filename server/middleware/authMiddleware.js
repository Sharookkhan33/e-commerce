const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  console.log("🔍 Checking Authorization Headers:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        console.error("🚨 No token found!");
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      console.log("✅ Token Received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔓 Decoded Token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("🚨 User not found for token:", decoded);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ User Authenticated:", req.user.email);
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    console.error("🚨 No Authorization header provided!");
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const adminProtect = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log("✅ Admin access granted:", req.user.email);
    next();
  } else {
    console.error("🚨 Access denied. Not an admin:", req.user);
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }
};

module.exports = { protect, adminProtect };
