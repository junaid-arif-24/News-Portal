import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if the Authorization header exists
    const token = req.headers.authorization?.split(' ')[1];

    // If no token, proceed without setting user info (unauthenticated user)
    if (!token) {
      return next(); // Continue to the next middleware (treat as unauthenticated user)
    }

    // Verify token and extract user ID
    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decodedData.id;

    // Find user in database and set role
    const user = await User.findById(req.userId);
    if (user) {
      req.userRole = user.role; // Set user role (admin or subscriber)
    }

    next();
  } catch (error) {
    // If token is invalid or any error occurs, treat as unauthenticated
    return next();
  }
};

export default optionalAuth;
