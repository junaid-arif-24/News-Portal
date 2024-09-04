import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import upload from '../utils/multer';
import News from '../models/News';
import User from '../models/User';
import Category from '../models/Category';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import multer from 'multer';
const upload2 = multer();

const router = express.Router();

interface AuthRequest extends Request {
    userId?: string;
  }
// Create news
router.post(
  '/create',
  auth,
  checkRole(['admin']),
  upload.array('images', 12),
  async (req: Request, res: Response) => {
    console.log('Files received:', req.files); 
    const { title, description, category, tags, visibility, youtubeUrl } = req.body;
    const files = req.files as Express.Multer.File[];
    if (!files) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    try {
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'news_images',
          format: 'jpeg',
        })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map(result => result.secure_url);

      // Automatically use the current date and time
      const currentDate = new Date();
      const date = currentDate.toISOString().slice(0, 10); // yyyy-mm-dd format
      const time = currentDate.toLocaleTimeString(); // current time

      const newNews = new News({
        title,
        description,
        images: imageUrls,
        date,
        time,
        category,
        tags: tags.split(','),
        visibility,
        youtubeUrl
      });
      await newNews.save();
      res.status(201).json(newNews);
    } catch (error) {
      console.error('Error creating news', error);
      res.status(400).json({ message: 'Error creating news', error });
    }
  }
);


  // Get trending news
  router.get('/trending', async (req, res) => {
    try {
      const trendingNews = await News.find({ visibility: 'public' }).populate('category', 'name').sort().limit(5);
      res.status(200).json(trendingNews);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching trending news', error });
    }
  });
  
  // Get the latest news
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const latestNews = await News.find().sort({ date: -1 }).limit(10); // Adjust the limit as needed
    res.status(200).json(latestNews);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching latest news', error });
  }
});



// Get all news with advanced filters

router.get('/', async (req, res) => {
  const { title, description, date, tags, category, visibility } = req.query;

  const query: any = {};

  if (title) query.title = { $regex: title, $options: 'i' };
  if (description) query.description = { $regex: description, $options: 'i' };
  if (date) query.date = new Date(date as string);
  if (typeof tags === 'string' && tags !== '') query.tags = { $in: tags.split(',') };
  if (category) {
    
    const categoryDoc = await Category.findOne({ name: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      return res.status(400).json({ message: 'Category not found' });
    }
  }
  if (typeof visibility === 'string') query.visibility = visibility;

  try {
    const news = await News.find(query).populate('category', 'name');
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching news', error });
  }
});

  

// Get news by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const news = await News.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('category', 'name').exec();
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching news', error });
  }
});

// Update news
router.put('/:id', auth, checkRole(['admin']),upload2.none(), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, tags, visibility ,youtubeUrl} = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, description, category, tags: tags.split(','), visibility,youtubeUrl },
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


// Get relatable news based on category and tags
router.get('/relatable/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const currentNews = await News.findById(id).populate('category');
    if (!currentNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    const relatableNews = await News.find({
      _id: { $ne: id },
      category: currentNews.category,
      tags: { $in: currentNews.tags },
    }).limit(4);

    res.status(200).json(relatableNews);
  } catch (error) {
    console.error('Error fetching relatable news', error);
    res.status(500).json({ message: 'Error fetching relatable news', error });
  }
});

router.get('/:id/saved', auth, async (req: AuthRequest, res: Response) => {
  // console.log("userId",req.userId)
  const { id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId).populate('savedNews');
    // console.log("user",user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ savedNews: user.savedNews });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving saved news', error });
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

// Unsave news
router.post('/:id/unsave', auth, async (req: AuthRequest, res: Response) => {
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

    if (user.savedNews && user.savedNews.includes(newsId)) {
      user.savedNews = user.savedNews.filter(savedNewsId => !savedNewsId.equals(newsId));
      await user.save();
    }

    res.status(200).json({ message: 'News unsaved' });
  } catch (error) {
    res.status(400).json({ message: 'Error unsaving news', error });
  }
});



  



export default router;
