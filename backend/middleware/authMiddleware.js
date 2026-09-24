const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN RECEIVED:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("TOKEN DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log("JWT ERROR:", error.name);
    console.log("JWT MESSAGE:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.name
    });
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {

    console.log("USER ROLE:", req.user.role);
    console.log("ALLOWED ROLES:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};


module.exports = {
  authenticate,
  authorize
};