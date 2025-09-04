import { Request, Response } from 'express';
import { IAdminController } from './IAdminController';
import { IAdminService } from '../../services/admin/IAdminService';
import { HttpStatus } from '../../constants/statusCode';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
// import { LoginAdminResponseDTO } from "../../dto/admin/adminAuth";

export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) { }


  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.adminService.loginAdmin(email, password);
      const REFRESH_COOKIE = Number(process.env.MAX_AGE)
      res.cookie('adminRefreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_COOKIE
      });

      res.status(HttpStatus.OK).json({
        message: 'Admin login successful',
        accessToken: result.accessToken,
      });
    } catch (error) {
      console.error(error)
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Login failed' });
    }
  }

  async logoutAdmin(req: Request, res: Response): Promise<void> {
    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.OK).json({ message: 'Admin logged out successfully' });
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.adminRefreshToken;

      if (!refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
        return;
      }

      const newAccessToken = await this.adminService.refreshAccessToken(refreshToken);

      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({ message: ERROR_MESSAGES.FORBIDDEN });
    }
  }
}
