
export interface Payload {
  id: string;
  role: string;
  email: string;
}
export interface ITokenService {
  generateToken(payload: Payload): string;
  verifyRefreshTokenAndGenerateAccess(refreshToken: string): string;
}
