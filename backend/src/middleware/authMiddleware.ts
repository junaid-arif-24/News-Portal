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
    // console.log("Entered auth middleware")
    const token = req.headers.authorization?.split(' ')[1];
    // console.log("token", token)
    if (!token) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decodedData.id;
    // console.log("req.userId in auth", req.userId)

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.userRole = user.role;
// console.log("req.userRole in auth", req.userRole)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

export default auth;
