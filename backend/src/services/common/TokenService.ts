import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../utils/GenerateToken';

import type { ITokenService, Payload } from '../../interfaces/common/ITokenService';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export class TokenService implements ITokenService {
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
        name?: string;
      };

      return generateAccessToken(decoded.id, decoded.email, decoded.role, decoded?.name);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
