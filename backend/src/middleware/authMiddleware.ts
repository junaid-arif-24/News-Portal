import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

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

    const decodedData = jwt.verify(token, 'your_jwt_secret') as { id: string };
    req.userId = decodedData.id;

    const user = await User.findById(req.userId);
    req.userRole = user?.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

export default auth;
