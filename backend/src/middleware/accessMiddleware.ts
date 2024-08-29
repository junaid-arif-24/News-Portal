import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  userId?: string;
}

const checkBlocked = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export default checkBlocked;
