import express from "express";
import {
  createBooking,
  getStripeConfig,
  confirmPayment,
  getMyBookings,
  getBookingById,
  respondToBooking,
  updateBookingStatus,
  cancelBooking,
  reviewBooking,
  reportDispute,
  getBookingStats,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/stripe/config", getStripeConfig);

// Protected routes
router.use(protect);

// Booking management
router.post("/", authorize("user"), createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/stats/overview", getBookingStats);
router.get("/:id", getBookingById);

// Payment
router.post("/:id/confirm-payment", authorize("user"), confirmPayment);

// Worker actions
router.put("/:id/respond", authorize("worker"), respondToBooking);
router.put("/:id/status", authorize("worker"), updateBookingStatus);

// Customer actions
router.post("/:id/review", authorize("user"), reviewBooking);

// Common actions
router.put("/:id/cancel", cancelBooking);
router.put("/:id/dispute", reportDispute);

export default router;
