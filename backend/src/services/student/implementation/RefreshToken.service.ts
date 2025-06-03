import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../../../utils/GenerateToken';

const REFRESH_SECRET=process.env.JWT_REFRESH_SECRET as string

export const refreshTokenService=(refreshToken:string):string=>{
    try{
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    return generateAccessToken(decoded.id, decoded.email, decoded.role)
    }catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}