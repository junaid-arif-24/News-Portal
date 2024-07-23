import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';

const router = express.Router();

// Example of a protected route
router.get('/admin', auth, checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});

export default router;
