import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import Category from '../models/Category';
import User from '../models/User';

const router = express.Router();
interface AuthRequest extends Request {
  userId?: string;
}

// Create category
router.post('/create', auth, checkRole(['admin']), async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
});

// Add subscription endpoint
router.post('/subscribe', auth, async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!user.subscriptions.includes(categoryId)) {
      user.subscriptions.push(categoryId);
      await user.save();
    }
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error subscribing', error });
  }
});

// Unsubscribe endpoint
router.post('/unsubscribe', auth, async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const index = user.subscriptions.indexOf(categoryId);
    if (index > -1) {
      user.subscriptions.splice(index, 1);
      await user.save();
    }
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error unsubscribing', error });
  }
});

// Fetch subscribed categories
router.get('/subscribed-categories', auth, async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId).populate('subscriptions');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscribed categories', error });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching categories', error });
  }
});

// Update category
router.put('/update/:id', auth, checkRole(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
});

// Delete category
router.delete('/delete/:id', auth, checkRole(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category', error });
  }
});



export default router;
