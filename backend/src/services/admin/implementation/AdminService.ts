import { generateAccessToken, generateRefreshToken } from "../../../utils/GenerateToken";
import { TokenService } from "../../common/TokenService";


export interface LoginAdminResponse {
  accessToken: string;
  refreshToken: string;
}

export class AdminService {
  constructor(
   private tokenService: TokenService
  ) {}
  async loginAdmin(email: string, password: string): Promise<LoginAdminResponse> {
   
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
 throw new Error("Invalid credentials");
}
    const accessToken = generateAccessToken(
      "admin",
      email,
      "admin"
    );
    const refreshToken = generateRefreshToken(
      "admin",
      email,
      "admin"
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
  return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
}
}