import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Stripe webhook endpoint
// IMPORTANT: This route must NOT use express.json() middleware
// Stripe requires raw request body for signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
