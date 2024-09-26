import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import upload from '../utils/multer';
import * as newsController from '../controllers/newsController';

const router = express.Router();

// Create news
router.post('/create', auth, checkRole(['admin']), upload.array('images', 12), newsController.createNews);

// Get trending news
router.get('/trending', newsController.getTrendingNews);

// Get the latest news
router.get('/latest', newsController.getLatestNews);

// Get all news with filters
router.get('/', newsController.getAllNews);

// Get saved news
router.get('/savedNews', auth, newsController.getSavedNews);

// Get news by ID
router.get('/:id', newsController.getNewsById);

// Update news
router.put('/:id', auth, checkRole(['admin']), upload.array('images', 12), newsController.updateNews);

// Delete news
router.delete('/:id', auth, checkRole(['admin']), newsController.deleteNews);

// Get relatable news based on category and tags
router.get('/relatable/:id', newsController.getRelatableNews);






// Save news
router.post('/:id/save', auth, newsController.saveNews);

// Unsave news
router.post('/:id/unsave', auth, newsController.unsaveNews);




export default router;
