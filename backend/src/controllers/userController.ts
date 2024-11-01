import { Request, Response } from 'express';
import User from '../models/User';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update user details (admin only)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role ,isBlocked} = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role, isBlocked }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Block/Unblock a user (admin only)
export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const { isBlocked } = req.body; // Expecting true or false from frontend
    await User.findByIdAndUpdate(req.params.id, { isBlocked }); // Set isBlocked based on frontend input
    res.status(200).json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user block status', error });
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
