import express from 'express';
import * as authController from '../controllers/authController';
import auth from '../middleware/authMiddleware';

const router = express.Router();

// Registration endpoint
router.post('/register', authController.register);

// Login endpoint
router.post('/login', authController.login);

// Forgot Password endpoint
router.post('/forgot-password', authController.forgotPassword);

// Reset Password endpoint
router.post('/reset-password', authController.resetPassword);

// Get current user endpoint
router.get('/user', auth, authController.getCurrentUser);

// Logout endpoint
router.post('/logout', authController.logout);

export default router;
