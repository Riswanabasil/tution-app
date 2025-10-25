import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

type Role = 'student' | 'tutor';
type JwtUser = { id: string; email: string; role: Role };

export function socketAuth(secret: string) {
  return (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('unauthorized'));
      const user = jwt.verify(token, secret) as JwtUser;
      socket.data.user = user;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  };
}
