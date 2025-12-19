import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete image',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message,
    });
  }
};

// @desc    Upload profile picture (avatar)
// @route   POST /api/upload/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const userId = req.user._id;
    const avatarUrl = req.file.path;

    // Update user's avatar in database
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: avatarUrl,
        user: user,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
};

// @desc    Upload worker portfolio images
// @route   POST /api/upload/portfolio
// @access  Private (Workers only)
export const uploadPortfolio = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const userId = req.user._id;
    const portfolioImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    // Update user's worker profile with portfolio images
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'worker') {
      return res.status(403).json({
        success: false,
        message: 'Only workers can upload portfolio images',
      });
    }

    // Initialize workerProfile.portfolio if it doesn't exist
    if (!user.workerProfile.portfolio) {
      user.workerProfile.portfolio = [];
    }

    // Add new portfolio images
    user.workerProfile.portfolio.push(...portfolioImages);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio images uploaded successfully',
      data: {
        portfolio: user.workerProfile.portfolio,
      },
    });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading portfolio images',
      error: error.message,
    });
  }
};
