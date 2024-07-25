import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decodedData.id;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

export default auth;
