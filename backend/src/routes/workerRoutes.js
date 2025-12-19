import express from "express";
import {
  getWorkerProfile,
  updateWorkerProfile,
  getAllWorkers,
  getWorkerById,
  getWorkerStats,
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

export default router;
