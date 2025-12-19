import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Stripe with secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

console.log("Stripe initialized:", !!stripe);

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
      throw new Error(
        "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables."
      );
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

// ============ STRIPE CONNECT FUNCTIONS ============

/**
 * Create a Stripe Connect account for worker
 * @param {Object} workerData - Worker information
 * @returns {Object} Stripe account object
 */
export const createConnectAccount = async (workerData) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const account = await stripe.accounts.create({
      type: "express",
      email: workerData.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        userId: workerData.userId,
        name: workerData.name,
      },
    });

    return {
      success: true,
      accountId: account.id,
    };
  } catch (error) {
    console.error("Create Connect account error:", error);
    throw new Error(error.message);
  }
};

/**
 * Create account link for Stripe Connect onboarding
 * @param {String} accountId - Stripe account ID
 * @param {String} returnUrl - URL to return after onboarding
 * @param {String} refreshUrl - URL to refresh if expired
 * @returns {Object} Account link object
 */
export const createAccountLink = async (accountId, returnUrl, refreshUrl) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return {
      success: true,
      url: accountLink.url,
    };
  } catch (error) {
    console.error("Create account link error:", error);
    throw new Error(error.message);
  }
};

/**
 * Retrieve Stripe Connect account details
 * @param {String} accountId - Stripe account ID
 * @returns {Object} Account details
 */
export const retrieveConnectAccount = async (accountId) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const account = await stripe.accounts.retrieve(accountId);
    return {
      success: true,
      account: {
        id: account.id,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        requirements: account.requirements,
      },
    };
  } catch (error) {
    console.error("Retrieve Connect account error:", error);
    throw new Error(error.message);
  }
};

/**
 * Create payment intent with Connect account (platform fee)
 * @param {Number} amount - Amount in dollars
 * @param {String} connectedAccountId - Worker's Stripe account ID
 * @param {Number} platformFeePercent - Platform fee percentage (default 10%)
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Payment intent object
 */
export const createConnectPaymentIntent = async (
  amount,
  connectedAccountId,
  platformFeePercent = 10,
  metadata = {}
) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const amountInCents = Math.round(amount * 100);
    const platformFee = Math.round((amountInCents * platformFeePercent) / 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      application_fee_amount: platformFee,
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      platformFee: platformFee / 100,
      workerAmount: (amountInCents - platformFee) / 100,
    };
  } catch (error) {
    console.error("Create Connect payment intent error:", error);
    throw new Error(error.message);
  }
};

/**
 * Create login link for Stripe Express Dashboard
 * @param {String} accountId - Stripe account ID
 * @returns {Object} Login link object
 */
export const createLoginLink = async (accountId) => {
  try {
    if (!stripe) {
      throw new Error("Stripe is not configured.");
    }

    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return {
      success: true,
      url: loginLink.url,
    };
  } catch (error) {
    console.error("Create login link error:", error);
    throw new Error(error.message);
  }
};
