import { LoginAdminResponseDTO } from '../../../dto/admin/adminAuth';
import { ITokenService } from '../../../interfaces/common/ITokenService';
import { generateAccessToken, generateRefreshToken } from '../../../utils/GenerateToken';
import { TokenService } from '../../common/TokenService';
import { IAdminService } from '../IAdminService';

export class AdminService implements IAdminService {
  constructor(private tokenService: ITokenService) {}
  async loginAdmin(email: string, password: string): Promise<LoginAdminResponseDTO> {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      throw new Error('Invalid credentials');
    }
    const accessToken = generateAccessToken('admin', email, 'admin');
    const refreshToken = generateRefreshToken('admin', email, 'admin');
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
  }
}
