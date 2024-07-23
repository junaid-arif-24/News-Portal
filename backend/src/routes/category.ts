import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import Category from '../models/Category';

const router = express.Router();

// Create category
router.post('/', auth, checkRole(['admin']), async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
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
router.put('/:id', auth, checkRole(['admin']), async (req, res) => {
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
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category', error });
  }
});

export default router;
