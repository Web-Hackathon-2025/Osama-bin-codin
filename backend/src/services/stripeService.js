import Stripe from "stripe";

// Initialize Stripe with secret key (only if key is provided)
let stripe;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Create a Stripe payment intent for booking
 * @param {Number} amount - Amount in dollars
 * @param {String} currency - Currency code (default: usd)
 * @param {Object} metadata - Additional metadata for the payment
 * @returns {Object} Payment intent object
 */
export const createPaymentIntent = async (
  amount,
  currency = "usd",
  metadata = {}
) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.");
    }
    
    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    throw new Error(error.message);
  }
};

/**
 * Retrieve payment intent details
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Object} Payment intent details
 */
export const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Retrieve payment intent error:", error);
    throw new Error(error.message);
  }
};

/**
 * Cancel a payment intent
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Object} Cancelled payment intent
 */
export const cancelPaymentIntent = async (paymentIntentId) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Cancel payment intent error:", error);
    throw new Error(error.message);
  }
};

/**
 * Create a refund for a payment
 * @param {String} paymentIntentId - Payment intent ID
 * @param {Number} amount - Amount to refund (optional, defaults to full amount)
 * @returns {Object} Refund object
 */
export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }
    const refundData = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error) {
    console.error("Create refund error:", error);
    throw new Error(error.message);
  }
};

/**
 * Confirm a payment intent
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Object} Confirmed payment intent
 */
export const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Confirm payment intent error:", error);
    throw new Error(error.message);
  }
};

/**
 * Get publishable key for frontend
 * @returns {String} Stripe publishable key
 */
export const getPublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY;
};
