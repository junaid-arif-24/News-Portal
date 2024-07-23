import { Request, Response, NextFunction } from 'express';

interface RoleRequest extends Request {
  userId?: string;
  userRole?: string;
}

const checkRole = (roles: string[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default checkRole;
