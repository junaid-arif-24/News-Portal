import express, { Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import User from '../models/User';
import Category from '../models/Category';
import checkRole from '../middleware/roleMiddleware';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}





// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  try {
    // Fetch only users with the role 'subscriber'
    const users = await User.find({ role: 'subscriber' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
// Block a user (admin only)
router.patch('/block/:id', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error });
  }
});

// Unblock a user (admin only)
router.patch('/unblock/:id', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking user', error });
  }
});

// Delete a user (admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
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

export default router;
