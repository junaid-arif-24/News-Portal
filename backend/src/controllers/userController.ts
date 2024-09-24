import { Request, Response } from 'express';
import User from '../models/User';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'subscriber' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Block a user (admin only)
export const blockUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error });
  }
};

// Unblock a user (admin only)
export const unblockUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking user', error });
  }
};

// Delete a user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
