import jwt from 'jsonwebtoken';

const ACCESS_TOKEN = process.env.JWT_SECRET as string;
const REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (
  id: string,
  email: string,
  role: string,
  name?: string,
): string => {
  return jwt.sign({ id, email, role, name }, ACCESS_TOKEN, { expiresIn: '30m' });
};

export const generateRefreshToken = (
  id: string,
  email: string,
  role: string,
  name?: string,
): string => {
  return jwt.sign({ id, email, role, name }, REFRESH_TOKEN, { expiresIn: '7d' });
};
