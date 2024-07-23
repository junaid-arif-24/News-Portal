import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import upload from '../utils/multer';
import News from '../models/News';

const router = express.Router();

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

// Get all news with visibility filter
// Get all news with filters
router.get('/', async (req : Request, res: Response) => {
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
  
// Get all news
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const news = await News.find();
//     res.status(200).json(news);
//   } catch (error) {
//     res.status(400).json({ message: 'Error fetching news', error });
//   }
// });

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

export default router;
