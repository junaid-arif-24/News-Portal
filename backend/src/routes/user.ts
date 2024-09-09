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





export default router;
