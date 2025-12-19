import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Check if user is verified
export const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email first",
      isVerified: false,
    });
  }
  next();
};

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Check if worker is approved
export const isWorkerApproved = (req, res, next) => {
  if (req.user.role !== "worker") {
    return res
      .status(403)
      .json({ message: "Only workers can access this route" });
  }

  if (!req.user.workerProfile || !req.user.workerProfile.isApproved) {
    return res.status(403).json({
      message: "Your worker account is pending admin approval",
    });
  }

  next();
};
