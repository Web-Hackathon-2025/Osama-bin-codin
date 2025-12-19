import express from "express";
import {
  getWorkerProfile,
  updateWorkerProfile,
  getAllWorkers,
  getWorkerById,
  getWorkerStats,
  createStripeAccount,
  getStripeOnboardingLink,
  getStripeAccountStatus,
  getStripeDashboardLink,
} from "../controllers/workerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);

// Protected routes (Worker only)
router.get("/profile/me", protect, authorize("worker"), getWorkerProfile);
router.put("/profile/me", protect, authorize("worker"), updateWorkerProfile);
router.get("/stats/me", protect, authorize("worker"), getWorkerStats);

// Stripe Connect routes
router.post(
  "/stripe/create-account",
  protect,
  authorize("worker"),
  createStripeAccount
);
router.get(
  "/stripe/onboarding-link",
  protect,
  authorize("worker"),
  getStripeOnboardingLink
);
router.get(
  "/stripe/status",
  protect,
  authorize("worker"),
  getStripeAccountStatus
);
router.get(
  "/stripe/dashboard",
  protect,
  authorize("worker"),
  getStripeDashboardLink
);

export default router;
