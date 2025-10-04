import { Request } from 'express';
export type Role = 'student' | 'tutor' | 'admin';
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role
  };
}
