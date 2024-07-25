import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import upload from '../utils/multer';
import News from '../models/News';
import User from '../models/User';
import Comment from '../models/Comment';
import mongoose from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
    userId?: string;
  }
// Create news
router.post(
  '/',
  auth,
  checkRole(['admin']),
  upload.array('images'),
  async (req: Request, res: Response) => {
    const { title, description, category, tags, visibility } = req.body;
    const files = req.files as Express.Multer.File[];
    const images = files.map((file: Express.Multer.File) => file.path);

    try {
      const newNews = new News({
        title,
        description,
        images,
        category,
        tags: tags.split(','),
        visibility,
      });
      await newNews.save();
      res.status(201).json(newNews);
    } catch (error) {
      res.status(400).json({ message: 'Error creating news', error });
    }
  }
);

// Get all news with filters
router.get('/filter', async (req: Request, res: Response) => {
  const visibility = req.query.visibility || 'public';
  const { title, description, date } = req.query;

  const query: any = { visibility };

  if (title) query.title = { $regex: title, $options: 'i' };
  if (description) query.description = { $regex: description, $options: 'i' };
  if (date) query.date = new Date(date as string);

  try {
    const news = await News.find(query);
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching news', error });
  }
});

// Get all news with advanced filters
router.get('/', async (req, res) => {
    const { title, description, date, tags, category } = req.query;
  
    const query: any = {};
  
    if (title) query.title = { $regex: title, $options: 'i' };
    if (description) query.description = { $regex: description, $options: 'i' };
    if (date) query.date = new Date(date as string);
    if (typeof tags === 'string') query.tags = { $in: tags.split(',') };
    if (category) query.category = category;
  
    try {
      const news = await News.find(query);
      res.status(200).json(news);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching news', error });
    }
  });
  

// Get news by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const news = await News.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching news', error });
  }
});

// Update news
router.put('/:id', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, tags, visibility } = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, description, category, tags: tags.split(','), visibility },
      { new: true }
    );
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: 'Error updating news', error });
  }
});

// Delete news
router.delete('/:id', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: 'News deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting news', error });
  }
});

// Save news
router.post('/:id/save', auth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newsId = new mongoose.Types.ObjectId(id);

    if (!user.savedNews) {
      user.savedNews = [];
    }

    if (!user.savedNews.includes(newsId)) {
      user.savedNews.push(newsId);
      await user.save();
    }

    res.status(200).json({ message: 'News saved' });
  } catch (error) {
    res.status(400).json({ message: 'Error saving news', error });
  }
});


// Add a comment to news
router.post('/:id/comments', auth, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
  
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    try {
      const comment = new Comment({ text, user: req.userId, news: new mongoose.Types.ObjectId(id) });
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: 'Error adding comment', error });
    }
  });
  
  // Get comments for a news article
  router.get('/:id/comments', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const comments = await Comment.find({ news: new mongoose.Types.ObjectId(id) }).populate('user', 'email');
      res.status(200).json(comments);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching comments', error });
    }
  });

  // Get trending news
router.get('/trending', async (req, res) => {
    try {
      const trendingNews = await News.find({ visibility: 'public' }).sort({ views: -1 }).limit(5);
      res.status(200).json(trendingNews);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching trending news', error });
    }
  });
  

export default router;
