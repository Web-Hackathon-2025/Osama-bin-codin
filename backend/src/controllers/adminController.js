import User from "../models/User.js";
import JobCategory from "../models/JobCategory.js";

// @desc    Get all users with role filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      isVerified,
      isActive,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select(
        "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending worker approvals
// @route   GET /api/admin/workers/pending
// @access  Private (Admin)
export const getPendingWorkers = async (req, res) => {
  try {
    const pendingWorkers = await User.find({
      role: "worker",
      isVerified: true,
      "workerProfile.isApproved": false,
    }).select(
      "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
    );

    res.json({
      count: pendingWorkers.length,
      workers: pendingWorkers,
    });
  } catch (error) {
    console.error("Get pending workers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject worker
// @route   PUT /api/admin/workers/:id/approval
// @access  Private (Admin)
export const updateWorkerApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (isApproved === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide approval status" });
    }

    const worker = await User.findById(req.params.id);

    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.workerProfile.isApproved = isApproved;
    await worker.save();

    res.json({
      message: `Worker ${isApproved ? "approved" : "rejected"} successfully`,
      worker: await User.findById(worker._id).select("-password"),
    });
  } catch (error) {
    console.error("Update worker approval error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({ message: "Please provide active status" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own status" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: await User.findById(user._id).select("-password"),
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalWorkers = await User.countDocuments({ role: "worker" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const approvedWorkers = await User.countDocuments({
      role: "worker",
      "workerProfile.isApproved": true,
    });
    const pendingWorkers = await User.countDocuments({
      role: "worker",
      "workerProfile.isApproved": false,
      isVerified: true,
    });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      totalUsers,
      totalWorkers,
      totalAdmins,
      approvedWorkers,
      pendingWorkers,
      verifiedUsers,
      activeUsers,
      totalAccounts: totalUsers + totalWorkers + totalAdmins,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job category
// @route   POST /api/admin/job-categories
// @access  Private (Admin)
export const createJobCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existingCategory = await JobCategory.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "Job category already exists" });
    }

    const category = await JobCategory.create({
      name,
      slug,
      description,
      icon: icon || "",
    });

    res.status(201).json({
      message: "Job category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create job category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all job categories
// @route   GET /api/admin/job-categories
// @access  Private (Admin)
export const getAllJobCategories = async (req, res) => {
  try {
    const categories = await JobCategory.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error("Get job categories error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job category
// @route   PUT /api/admin/job-categories/:id
// @access  Private (Admin)
export const updateJobCategory = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;

    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, "-");
    }
    if (description) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      message: "Job category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update job category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job category
// @route   DELETE /api/admin/job-categories/:id
// @access  Private (Admin)
export const deleteJobCategory = async (req, res) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    await JobCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Job category deleted successfully" });
  } catch (error) {
    console.error("Delete job category error:", error);
    res.status(500).json({ message: error.message });
  }
};
