import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import * as categoryController from '../controllers/categoryController';
import optionalAuth from '../middleware/optionalAuthMiddleware';

const router = express.Router();

// Create category
router.post('/create', auth, checkRole(['admin']), categoryController.createCategory);

// Add subscription
router.post('/subscribe', auth, categoryController.subscribeCategory);

// Unsubscribe
router.post('/unsubscribe', auth, categoryController.unsubscribeCategory);

// Fetch subscribed categories
router.get('/subscribed-categories', auth, categoryController.getSubscribedCategories);

// Get all categories
router.get('/',optionalAuth, categoryController.getAllCategories);

// Update category
router.put('/update/:id', auth, checkRole(['admin']), categoryController.updateCategory);

// Delete category
router.delete('/delete/:id', auth, checkRole(['admin']), categoryController.deleteCategory);

export default router;
