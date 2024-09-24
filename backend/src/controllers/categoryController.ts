import { Request, Response } from 'express';
import Category from '../models/Category';
import User from '../models/User';

interface AuthRequest extends Request {
  userId?: string;
}

// Create category
export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
};

// Add subscription endpoint
export const subscribeCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
};

// Unsubscribe endpoint
export const unsubscribeCategory = async (req: AuthRequest, res: Response) => {
  const { categoryId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
};

// Fetch subscribed categories
export const getSubscribedCategories = async (req: AuthRequest, res: Response) => {
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
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching categories', error });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category', error });
  }
};
