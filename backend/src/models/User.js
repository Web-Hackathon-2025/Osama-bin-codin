import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
      required: true,
    },
    // Worker-specific fields
    workerProfile: {
      jobCategories: [
        {
          type: String,
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
      ],
      experience: {
        type: Number, // in years
        min: 0,
      },
      hourlyRate: {
        type: Number,
        min: 0,
      },
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
      certifications: [
        {
          name: String,
          issuedBy: String,
          issuedDate: Date,
        },
      ],
      availability: {
        type: String,
        enum: ["full-time", "part-time", "weekends", "flexible"],
        default: "flexible",
      },
      serviceAreas: [
        {
          type: String,
          trim: true,
        },
      ],
      isApproved: {
        type: Boolean,
        default: false,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalJobs: {
        type: Number,
        default: 0,
      },
      completedJobs: {
        type: Number,
        default: 0,
      },
      // Stripe Connect fields for receiving payments
      stripeAccountId: {
        type: String,
        default: null,
      },
      stripeOnboardingComplete: {
        type: Boolean,
        default: false,
      },
      stripeDetailsSubmitted: {
        type: Boolean,
        default: false,
      },
      stripeChargesEnabled: {
        type: Boolean,
        default: false,
      },
      stripePayoutsEnabled: {
        type: Boolean,
        default: false,
      },
      portfolio: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
