// Packages
const jwt = require("jsonwebtoken");

// Project dependencies
const Users = require("../mongo/models/Users");

const protect = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Verify the token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Add the user ID to the request object
    req.userId = decoded.userId;

    // Check if the user is active
    const user = await Users.findById(req.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Move to the next middleware
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};

module.exports = protect;
