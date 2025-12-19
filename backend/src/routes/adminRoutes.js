import express from "express";
import {
  getAllUsers,
  getPendingWorkers,
  updateWorkerApproval,
  updateUserStatus,
  updateUser,
  deleteUser,
  getDashboardStats,
  createJobCategory,
  getAllJobCategories,
  updateJobCategory,
  deleteJobCategory,
  getAllBookings,
  getPlatformBookingStats,
  getDisputedBookings,
  resolveDispute,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected and require admin role
router.use(protect, authorize("admin"));

// User management
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Worker management
router.get("/workers/pending", getPendingWorkers);
router.put("/workers/:id/approval", updateWorkerApproval);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Job category management
router.post("/job-categories", createJobCategory);
router.get("/job-categories", getAllJobCategories);
router.put("/job-categories/:id", updateJobCategory);
router.delete("/job-categories/:id", deleteJobCategory);

// Booking management
router.get("/bookings", getAllBookings);
router.get("/bookings/stats", getPlatformBookingStats);
router.get("/bookings/disputed", getDisputedBookings);
router.put("/bookings/:id/resolve-dispute", resolveDispute);

export default router;
