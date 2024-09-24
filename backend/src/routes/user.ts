import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import * as userController from '../controllers/userController';

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), userController.getAllUsers);

// Block a user (admin only)
router.patch('/block/:id', auth, checkRole(['admin']), userController.blockUser);

// Unblock a user (admin only)
router.patch('/unblock/:id', auth, checkRole(['admin']), userController.unblockUser);

// Delete a user (admin only)
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);

export default router;
