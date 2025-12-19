import Booking from "../models/Booking.js";
import User from "../models/User.js";
import {
  createPaymentIntent,
  createConnectPaymentIntent,
  cancelPaymentIntent,
  createRefund,
  retrievePaymentIntent,
  getPublishableKey,
} from "../services/stripeService.js";
import {
  notifyBookingCreated,
  notifyBookingAccepted,
  notifyBookingRejected,
  notifyBookingCancelled,
  notifyBookingCompleted,
  notifyPaymentReceived,
  notifyReviewReceived,
} from "../services/notificationService.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res) => {
  try {
    const {
      workerId,
      serviceCategory,
      description,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      paymentMethod,
      notes,
    } = req.body;

    // Validation
    if (
      !workerId ||
      !serviceCategory ||
      !description ||
      !scheduledDate ||
      !scheduledTime ||
      !estimatedHours
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
        missing: {
          workerId: !workerId,
          serviceCategory: !serviceCategory,
          description: !description,
          scheduledDate: !scheduledDate,
          scheduledTime: !scheduledTime,
          estimatedHours: !estimatedHours,
        },
      });
    }

    // Check if worker exists and is approved
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (!worker.workerProfile.isApproved) {
      return res.status(403).json({ message: "Worker is not approved yet" });
    }

    // Verify the customer is not booking themselves
    if (req.user._id.toString() === workerId) {
      return res.status(400).json({ message: "You cannot book yourself" });
    }

    // Calculate total amount
    const hourlyRate = worker.workerProfile.hourlyRate;
    const totalAmount = hourlyRate * estimatedHours;

    // Create booking data
    const bookingData = {
      customer: req.user._id,
      worker: workerId,
      serviceCategory,
      description,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      hourlyRate,
      totalAmount,
      paymentMethod: paymentMethod || "none",
      notes,
      status: "pending",
    };

    // Handle Stripe payment if payment method is stripe
    if (paymentMethod === "stripe") {
      // Check if worker has Stripe account set up
      if (
        !worker.workerProfile.stripeAccountId ||
        !worker.workerProfile.stripeOnboardingComplete
      ) {
        return res.status(400).json({
          message:
            "Worker has not completed Stripe setup. Please choose cash payment or select another worker.",
        });
      }

      try {
        // Use Stripe Connect to pay worker directly (10% platform fee)
        const paymentIntent = await createConnectPaymentIntent(
          totalAmount,
          worker.workerProfile.stripeAccountId,
          10, // 10% platform fee
          {
            customerId: req.user._id.toString(),
            customerName: req.user.name,
            workerId: workerId,
            workerName: worker.name,
            serviceCategory,
            bookingDescription: description,
          }
        );

        bookingData.paymentIntentId = paymentIntent.paymentIntentId;
        bookingData.paymentStatus = "pending";
        bookingData.platformFee = paymentIntent.platformFee;
        bookingData.workerAmount = paymentIntent.workerAmount;

        const booking = await Booking.create(bookingData);
        await booking.populate(
          "worker",
          "name email phone avatar workerProfile"
        );

        // Send notification to worker
        await notifyBookingCreated(workerId, req.user._id, booking._id);

        return res.status(201).json({
          message: "Booking created successfully",
          booking,
          clientSecret: paymentIntent.clientSecret,
          requiresPayment: true,
          platformFee: paymentIntent.platformFee,
          workerAmount: paymentIntent.workerAmount,
        });
      } catch (error) {
        console.error("Stripe payment error:", error);
        return res
          .status(500)
          .json({ message: "Payment initialization failed" });
      }
    }

    // For cash or no payment method
    const booking = await Booking.create(bookingData);
    await booking.populate("worker", "name email phone avatar workerProfile");

    // Send notification to worker
    await notifyBookingCreated(workerId, req.user._id, booking._id);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      requiresPayment: false,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/bookings/stripe/config
// @access  Public
export const getStripeConfig = async (req, res) => {
  try {
    res.json({
      publishableKey: getPublishableKey(),
    });
  } catch (error) {
    console.error("Get Stripe config error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm payment for booking
// @route   POST /api/bookings/:id/confirm-payment
// @access  Private (Customer)
export const confirmPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the user is the customer
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!booking.paymentIntentId) {
      return res.status(400).json({ message: "No payment intent found" });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await retrievePaymentIntent(booking.paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      booking.paymentStatus = "paid";
      booking.isPaid = true;
      booking.paidAt = new Date();
      booking.transactionId = paymentIntent.id;
      await booking.save();

      return res.json({
        message: "Payment confirmed successfully",
        booking,
      });
    }

    res.status(400).json({
      message: "Payment not completed",
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for current user (customer or worker)
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter based on user role
    if (req.user.role === "worker") {
      query.worker = req.user._id;
    } else {
      query.customer = req.user._id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone avatar")
      .populate("worker", "name email phone avatar workerProfile")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone avatar")
      .populate("worker", "name email phone avatar workerProfile");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is involved in the booking
    const isCustomer =
      booking.customer._id.toString() === req.user._id.toString();
    const isWorker = booking.worker._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Worker accepts or rejects booking
// @route   PUT /api/bookings/:id/respond
// @access  Private (Worker)
export const respondToBooking = async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Please provide valid status (accepted/rejected)" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the user is the worker
    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Booking has already been responded to" });
    }

    booking.status = status;
    booking.workerResponse = {
      status,
      message: message || "",
      respondedAt: new Date(),
    };

    await booking.save();
    await booking.populate("customer", "name email phone avatar");
    await booking.populate("worker", "name email phone avatar workerProfile");

    // Send notification to customer
    if (status === "accepted") {
      await notifyBookingAccepted(
        booking.customer._id,
        req.user._id,
        booking._id
      );
    } else if (status === "rejected") {
      await notifyBookingRejected(
        booking.customer._id,
        req.user._id,
        booking._id
      );
    }

    res.json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Respond to booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Worker)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["in-progress", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Please provide valid status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the user is the worker
    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (status === "completed") {
      booking.completionDetails = {
        completedAt: new Date(),
        completedBy: req.user._id,
        notes: req.body.notes || "",
        actualHours: req.body.actualHours || booking.estimatedHours,
      };

      // Update worker stats
      const worker = await User.findById(req.user._id);
      worker.workerProfile.completedJobs =
        (worker.workerProfile.completedJobs || 0) + 1;
      await worker.save();

      // Notify customer that booking is completed
      await notifyBookingCompleted(
        booking.customer._id,
        req.user._id,
        booking._id
      );
    }

    booking.status = status;
    await booking.save();
    await booking.populate("customer", "name email phone avatar");
    await booking.populate("worker", "name email phone avatar workerProfile");

    res.json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is customer or worker
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isWorker = booking.worker.toString() === req.user._id.toString();

    if (!isCustomer && !isWorker) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel this booking" });
    }

    // Handle refund if payment was made
    if (booking.isPaid && booking.paymentIntentId) {
      try {
        await createRefund(booking.paymentIntentId);
        booking.paymentStatus = "refunded";
      } catch (error) {
        console.error("Refund error:", error);
        // Continue with cancellation even if refund fails
      }
    }

    booking.status = "cancelled";
    booking.cancellationDetails = {
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
      reason: reason || "",
    };

    await booking.save();
    await booking.populate("customer", "name email phone avatar");
    await booking.populate("worker", "name email phone avatar workerProfile");

    // Notify the other party
    const otherPartyId = isCustomer ? booking.worker._id : booking.customer._id;
    await notifyBookingCancelled(otherPartyId, req.user._id, booking._id);

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate and review booking
// @route   POST /api/bookings/:id/review
// @access  Private (Customer)
export const reviewBooking = async (req, res) => {
  try {
    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res
        .status(400)
        .json({ message: "Please provide a rating between 1 and 5" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the user is the customer
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only customers can review bookings" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Can only review completed bookings" });
    }

    if (booking.rating && booking.rating.score) {
      return res.status(400).json({ message: "Booking already reviewed" });
    }

    booking.rating = {
      score,
      review: review || "",
      reviewedAt: new Date(),
    };

    await booking.save();

    // Update worker's average rating
    const worker = await User.findById(booking.worker);
    const workerBookings = await Booking.find({
      worker: booking.worker,
      "rating.score": { $exists: true },
    });

    const totalRating = workerBookings.reduce(
      (sum, b) => sum + b.rating.score,
      0
    );
    worker.workerProfile.rating = totalRating / workerBookings.length;
    await worker.save();

    await booking.populate("customer", "name email phone avatar");
    await booking.populate("worker", "name email phone avatar workerProfile");

    // Notify worker about the review
    await notifyReviewReceived(
      booking.worker._id,
      req.user._id,
      booking._id,
      score
    );

    res.json({
      message: "Review submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("Review booking error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report dispute for booking
// @route   PUT /api/bookings/:id/dispute
// @access  Private
export const reportDispute = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ message: "Please provide a reason for the dispute" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is customer or worker
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isWorker = booking.worker.toString() === req.user._id.toString();

    if (!isCustomer && !isWorker) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Can only dispute completed bookings" });
    }

    booking.status = "disputed";
    if (!booking.disputeDetails) {
      booking.disputeDetails = {};
    }
    booking.disputeDetails = {
      reportedBy: req.user._id,
      reportedAt: new Date(),
      reason: reason,
    };

    await booking.save();
    await booking.populate("customer", "name email phone avatar");
    await booking.populate("worker", "name email phone avatar workerProfile");

    res.json({
      message: "Dispute reported successfully. Admin will review this case.",
      booking,
    });
  } catch (error) {
    console.error("Report dispute error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private
export const getBookingStats = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "worker") {
      query.worker = req.user._id;
    } else if (req.user.role === "user") {
      query.customer = req.user._id;
    }

    const totalBookings = await Booking.countDocuments(query);
    const pendingBookings = await Booking.countDocuments({
      ...query,
      status: "pending",
    });
    const acceptedBookings = await Booking.countDocuments({
      ...query,
      status: "accepted",
    });
    const completedBookings = await Booking.countDocuments({
      ...query,
      status: "completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      ...query,
      status: "cancelled",
    });

    const totalSpent = await Booking.aggregate([
      { $match: { ...query, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalBookings,
      pendingBookings,
      acceptedBookings,
      completedBookings,
      cancelledBookings,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({ message: error.message });
  }
};
