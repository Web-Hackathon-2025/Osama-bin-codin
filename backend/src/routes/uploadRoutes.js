import express from 'express';
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  uploadAvatar,
  uploadPortfolio,
} from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload single image (general purpose)
router.post('/single', upload.single('image'), uploadSingleImage);

// Upload multiple images (general purpose)
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

// Upload avatar/profile picture
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// Upload portfolio images (for workers)
router.post('/portfolio', upload.array('portfolio', 10), uploadPortfolio);

// Delete image
router.delete('/:publicId', deleteImage);

export default router;
