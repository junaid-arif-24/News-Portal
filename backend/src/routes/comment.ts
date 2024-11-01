import express from 'express';
import auth from '../middleware/authMiddleware';
import * as commentController from '../controllers/commentController';

const router = express.Router();

// Get all comments
router.get('/all', auth, commentController.getAllComments);

// Add a comment to news
router.post('/:id/comments', auth, commentController.addComment);

// Get comments for a news article
// router.get('/:id/comments', commentController.getCommentsForNews);

// Delete a comment
router.delete('/:id', auth, commentController.deleteComment);

export default router;
