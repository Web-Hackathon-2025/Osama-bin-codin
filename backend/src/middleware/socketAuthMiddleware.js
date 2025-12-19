import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate socket connections (optional for testing)
export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    // Allow connections without token (for testing)
    if (!token) {
      console.log('⚠️  Socket connected without authentication (test mode)');
      socket.userId = 'anonymous-' + socket.id;
      socket.user = {
        _id: socket.userId,
        name: 'Anonymous User',
        email: 'anonymous@test.com',
      };
      return next();
    }

    // Verify token if provided
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    console.log(`✅ User authenticated: ${user.name}`);
    next();
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    next(new Error('Invalid or expired token'));
  }
};
