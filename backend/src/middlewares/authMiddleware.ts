import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StudentRepository } from '../repositories/student/implementation/studentRepository';
import { AuthenticatedRequest } from '../types/Index';
const studentRepo = new StudentRepository();

dotenv.config();
type Role = 'student' | 'tutor';
type JwtUser = { id: string; email: string; role: Role };
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized - No token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser;

    req.user = decoded;
    if (req.user.role === 'student') {
      const s = await studentRepo.getAuthStateById(req.user.id);
      if (!s) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      if (s.isBlocked) {
        res.status(403).json({ message: 'ACCOUNT_BLOCKED' });
        return;
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
