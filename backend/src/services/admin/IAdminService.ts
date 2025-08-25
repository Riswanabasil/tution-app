import { LoginAdminResponseDTO } from "../../dto/admin/adminAuth";

export interface IAdminService {
  loginAdmin(email: string, password: string): Promise<LoginAdminResponseDTO>;
  refreshAccessToken(refreshToken: string): Promise<string>;
}