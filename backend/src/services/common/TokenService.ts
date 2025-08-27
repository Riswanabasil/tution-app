import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../utils/GenerateToken';

interface Payload {
  id: string;
  role: string;
  email: string;
}
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export class TokenService {
  generateToken(payload: Payload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }

  verifyRefreshTokenAndGenerateAccess(refreshToken: string): string {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        id: string;
        email: string;
        role: string;
      };

      return generateAccessToken(decoded.id, decoded.email, decoded.role);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
