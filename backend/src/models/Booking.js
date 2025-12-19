import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
      enum: [
        "plumber",
        "electrician",
        "carpenter",
        "painter",
        "cleaner",
        "gardener",
        "mechanic",
        "ac-technician",
        "appliance-repair",
        "pest-control",
        "home-renovation",
        "moving-services",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    serviceAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0.5,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", // Waiting for worker response
        "accepted", // Worker accepted
        "rejected", // Worker rejected
        "in-progress", // Service ongoing
        "completed", // Service completed
        "cancelled", // Cancelled by customer/worker
        "disputed", // Issue reported
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash", "none"],
      default: "none",
    },
    paymentIntentId: {
      type: String, // Stripe payment intent ID
    },
    transactionId: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    workerResponse: {
      status: String,
      message: String,
      respondedAt: Date,
    },
    completionDetails: {
      completedAt: Date,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      notes: String,
      actualHours: Number,
    },
    cancellationDetails: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancelledAt: Date,
      reason: String,
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      reviewedAt: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
