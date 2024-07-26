import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import User from '../models/User';
import Category from '../models/Category';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

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

export default router;