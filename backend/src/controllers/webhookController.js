import Stripe from "stripe";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { notifyPaymentReceived } from "../services/notificationService.js";

// Initialize Stripe only if keys are configured
let stripe;
if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_your_stripe_secret_key_here"
) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Handle Stripe webhook events
// @route   POST /api/webhooks/stripe
// @access  Public (Stripe only)
export const handleStripeWebhook = async (req, res) => {
  // Check if Stripe is configured
  if (!stripe) {
    console.warn("⚠️  Stripe webhook received but Stripe is not configured");
    return res.status(200).json({
      received: true,
      message: "Stripe not configured - webhook ignored",
    });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("⚠️  STRIPE_WEBHOOK_SECRET not configured");
    return res.status(400).json({
      error: "Webhook secret not configured",
    });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe webhook event received:", event.type);

  try {
    // Handle the event
    switch (event.type) {
      // Payment Intent Events
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object);
        break;

      // Charge Events (for Connect)
      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object);
        break;

      case "charge.failed":
        await handleChargeFailed(event.data.object);
        break;

      // Account Events (Connect onboarding)
      case "account.updated":
        await handleAccountUpdated(event.data.object);
        break;

      // Transfer Events (payouts to workers)
      case "transfer.created":
        await handleTransferCreated(event.data.object);
        break;

      case "transfer.paid":
        await handleTransferPaid(event.data.object);
        break;

      case "transfer.failed":
        await handleTransferFailed(event.data.object);
        break;

      // Payout Events
      case "payout.paid":
        await handlePayoutPaid(event.data.object);
        break;

      case "payout.failed":
        await handlePayoutFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

// ============================================
// WEBHOOK EVENT HANDLERS
// ============================================

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log("💰 Payment succeeded:", paymentIntent.id);

  try {
    // Find booking by payment intent ID
    const booking = await Booking.findOne({
      paymentIntentId: paymentIntent.id,
    }).populate("workerId", "name email");

    if (!booking) {
      console.log("No booking found for payment intent:", paymentIntent.id);
      return;
    }

    // Update booking payment status
    booking.paymentStatus = "paid";
    await booking.save();

    console.log(`✅ Booking ${booking._id} payment confirmed`);

    // Notify worker about payment received
    if (booking.workerId) {
      await notifyPaymentReceived(
        booking.workerId._id,
        booking._id,
        booking.estimatedCost
      );
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log("❌ Payment failed:", paymentIntent.id);

  try {
    const booking = await Booking.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (booking) {
      booking.paymentStatus = "failed";
      await booking.save();
      console.log(`Payment failed for booking ${booking._id}`);
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent) {
  console.log("🚫 Payment canceled:", paymentIntent.id);

  try {
    const booking = await Booking.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (booking) {
      booking.paymentStatus = "cancelled";
      await booking.save();
      console.log(`Payment cancelled for booking ${booking._id}`);
    }
  } catch (error) {
    console.error("Error handling payment cancellation:", error);
  }
}

async function handleChargeSucceeded(charge) {
  console.log("💳 Charge succeeded:", charge.id);

  // Handle successful charge for Connect accounts
  if (charge.transfer_data) {
    console.log(
      `Transfer to connected account: ${charge.transfer_data.destination}`
    );
  }
}

async function handleChargeFailed(charge) {
  console.log("❌ Charge failed:", charge.id);
  console.error("Failure reason:", charge.failure_message);
}

async function handleAccountUpdated(account) {
  console.log("🔄 Account updated:", account.id);

  try {
    // Find worker with this Stripe account
    const worker = await User.findOne({
      "workerProfile.stripeAccountId": account.id,
    });

    if (worker) {
      console.log(`Found worker: ${worker.name} (${worker.email})`);

      // Update worker's Stripe account status
      worker.workerProfile.stripeDetailsSubmitted = account.details_submitted;
      worker.workerProfile.stripeChargesEnabled = account.charges_enabled;
      worker.workerProfile.stripePayoutsEnabled = account.payouts_enabled;

      // Consider onboarding complete if all required info is submitted
      if (
        account.details_submitted &&
        account.charges_enabled &&
        account.payouts_enabled
      ) {
        worker.workerProfile.stripeOnboardingComplete = true;
        console.log(`✅ Worker ${worker.name} completed Stripe onboarding`);
      } else {
        console.log(
          `⏳ Stripe status - Details: ${account.details_submitted}, Charges: ${account.charges_enabled}, Payouts: ${account.payouts_enabled}`
        );
      }

      await worker.save();
      console.log(`💾 Worker profile updated successfully`);
    } else {
      console.log(`⚠️  No worker found with Stripe account ID: ${account.id}`);
    }
  } catch (error) {
    console.error("Error handling account update:", error);
  }
}

async function handleTransferCreated(transfer) {
  console.log("📤 Transfer created:", transfer.id);
  console.log(`Amount: ${transfer.amount / 100} ${transfer.currency}`);
  console.log(`Destination: ${transfer.destination}`);
}

async function handleTransferPaid(transfer) {
  console.log("✅ Transfer paid:", transfer.id);
}

async function handleTransferFailed(transfer) {
  console.log("❌ Transfer failed:", transfer.id);
  console.error("Failure reason:", transfer.failure_message);
}

async function handlePayoutPaid(payout) {
  console.log("💸 Payout completed:", payout.id);
  console.log(`Amount: ${payout.amount / 100} ${payout.currency}`);
}

async function handlePayoutFailed(payout) {
  console.log("❌ Payout failed:", payout.id);
  console.error("Failure reason:", payout.failure_message);
}

export default handleStripeWebhook;
