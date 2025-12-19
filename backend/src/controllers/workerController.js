import User from "../models/User.js";
import {
  createConnectAccount,
  createAccountLink,
  retrieveConnectAccount,
  createLoginLink,
} from "../services/stripeService.js";

// @desc    Get worker profile
// @route   GET /api/workers/profile
// @access  Private (Worker)
export const getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id).select("-password");

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    res.json(worker);
  } catch (error) {
    console.error("Get worker profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/profile
// @access  Private (Worker)
export const updateWorkerProfile = async (req, res) => {
  try {
    const {
      jobCategories,
      experience,
      hourlyRate,
      skills,
      certifications,
      availability,
      serviceAreas,
      bio,
      phone,
    } = req.body;

    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    // Update basic fields
    if (bio !== undefined) worker.bio = bio;
    if (phone !== undefined) worker.phone = phone;

    // Update worker profile
    if (jobCategories) worker.workerProfile.jobCategories = jobCategories;
    if (experience !== undefined) worker.workerProfile.experience = experience;
    if (hourlyRate !== undefined) worker.workerProfile.hourlyRate = hourlyRate;
    if (skills) worker.workerProfile.skills = skills;
    if (certifications) worker.workerProfile.certifications = certifications;
    if (availability) worker.workerProfile.availability = availability;
    if (serviceAreas) worker.workerProfile.serviceAreas = serviceAreas;

    await worker.save();

    res.json({
      message: "Profile updated successfully",
      worker: await User.findById(worker._id).select("-password"),
    });
  } catch (error) {
    console.error("Update worker profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved workers
// @route   GET /api/workers
// @access  Public
export const getAllWorkers = async (req, res) => {
  try {
    const { jobCategory, minRate, maxRate, availability, serviceArea, search } =
      req.query;

    // Build query
    const query = {
      role: "worker",
      isVerified: true,
      isActive: true,
      "workerProfile.isApproved": true,
    };

    if (jobCategory) {
      query["workerProfile.jobCategories"] = jobCategory;
    }

    if (minRate || maxRate) {
      query["workerProfile.hourlyRate"] = {};
      if (minRate) query["workerProfile.hourlyRate"].$gte = Number(minRate);
      if (maxRate) query["workerProfile.hourlyRate"].$lte = Number(maxRate);
    }

    if (availability) {
      query["workerProfile.availability"] = availability;
    }

    if (serviceArea) {
      query["workerProfile.serviceAreas"] = serviceArea;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { "workerProfile.skills": { $regex: search, $options: "i" } },
      ];
    }

    const workers = await User.find(query)
      .select(
        "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
      )
      .sort({ "workerProfile.rating": -1, createdAt: -1 });

    res.json({
      message: "Workers retrieved successfully",
      count: workers.length,
      data: workers,
    });
  } catch (error) {
    console.error("Get all workers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get worker by ID
// @route   GET /api/workers/:id
// @access  Public
export const getWorkerById = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select(
      "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
    );

    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (!worker.workerProfile.isApproved) {
      return res
        .status(403)
        .json({ message: "Worker profile not approved yet" });
    }

    res.json(worker);
  } catch (error) {
    console.error("Get worker by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get worker statistics
// @route   GET /api/workers/stats/me
// @access  Private (Worker)
export const getWorkerStats = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    const stats = {
      totalJobs: worker.workerProfile.totalJobs || 0,
      completedJobs: worker.workerProfile.completedJobs || 0,
      rating: worker.workerProfile.rating || 0,
      isApproved: worker.workerProfile.isApproved || false,
      joinedDate: worker.createdAt,
      stripeOnboardingComplete:
        worker.workerProfile.stripeOnboardingComplete || false,
    };

    res.json(stats);
  } catch (error) {
    console.error("Get worker stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe Connect account for worker
// @route   POST /api/workers/stripe/create-account
// @access  Private (Worker)
export const createStripeAccount = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    // Check if already has account
    if (worker.workerProfile.stripeAccountId) {
      return res.status(400).json({
        message: "Stripe account already exists",
        accountId: worker.workerProfile.stripeAccountId,
      });
    }

    // Create Stripe Connect account
    const account = await createConnectAccount({
      userId: worker._id.toString(),
      email: worker.email,
      name: worker.name,
    });

    // Save account ID to worker profile
    worker.workerProfile.stripeAccountId = account.accountId;
    await worker.save();

    res.json({
      message: "Stripe account created successfully",
      accountId: account.accountId,
    });
  } catch (error) {
    console.error("Create Stripe account error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Stripe onboarding link
// @route   GET /api/workers/stripe/onboarding-link
// @access  Private (Worker)
export const getStripeOnboardingLink = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    if (!worker.workerProfile.stripeAccountId) {
      return res.status(400).json({
        message: "No Stripe account found. Please create one first.",
      });
    }

    const returnUrl = `${process.env.FRONTEND_URL}/worker/stripe/return`;
    const refreshUrl = `${process.env.FRONTEND_URL}/worker/stripe/refresh`;

    const accountLink = await createAccountLink(
      worker.workerProfile.stripeAccountId,
      returnUrl,
      refreshUrl
    );

    res.json({
      url: accountLink.url,
    });
  } catch (error) {
    console.error("Get onboarding link error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check Stripe account status
// @route   GET /api/workers/stripe/status
// @access  Private (Worker)
export const getStripeAccountStatus = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    if (!worker.workerProfile.stripeAccountId) {
      return res.json({
        hasAccount: false,
        message: "No Stripe account connected",
      });
    }

    const accountDetails = await retrieveConnectAccount(
      worker.workerProfile.stripeAccountId
    );

    // Update worker profile with latest status
    worker.workerProfile.stripeDetailsSubmitted =
      accountDetails.account.detailsSubmitted;
    worker.workerProfile.stripeChargesEnabled =
      accountDetails.account.chargesEnabled;
    worker.workerProfile.stripePayoutsEnabled =
      accountDetails.account.payoutsEnabled;
    worker.workerProfile.stripeOnboardingComplete =
      accountDetails.account.detailsSubmitted &&
      accountDetails.account.chargesEnabled;

    await worker.save();

    res.json({
      hasAccount: true,
      accountId: worker.workerProfile.stripeAccountId,
      detailsSubmitted: accountDetails.account.detailsSubmitted,
      chargesEnabled: accountDetails.account.chargesEnabled,
      payoutsEnabled: accountDetails.account.payoutsEnabled,
      onboardingComplete: worker.workerProfile.stripeOnboardingComplete,
      requirements: accountDetails.account.requirements,
    });
  } catch (error) {
    console.error("Get Stripe status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Stripe dashboard link
// @route   GET /api/workers/stripe/dashboard
// @access  Private (Worker)
export const getStripeDashboardLink = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (worker.role !== "worker") {
      return res.status(403).json({ message: "Not a worker account" });
    }

    if (!worker.workerProfile.stripeAccountId) {
      return res.status(400).json({
        message: "No Stripe account found.",
      });
    }

    const loginLink = await createLoginLink(
      worker.workerProfile.stripeAccountId
    );

    res.json({
      url: loginLink.url,
    });
  } catch (error) {
    console.error("Get dashboard link error:", error);
    res.status(500).json({ message: error.message });
  }
};
