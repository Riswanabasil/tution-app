import { Request, Response } from "express";
import { AdminService, LoginAdminResponse } from "../../services/admin/implementation/AdminService";

export class AdminController {
  constructor(private adminService: AdminService) {}

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result: LoginAdminResponse = await this.adminService.loginAdmin(
        email,
        password
      );

      res.cookie("adminRefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Admin login successful",
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Login failed" });
    }
  }

  async logoutAdmin(req: Request, res: Response): Promise<void> {
     res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
    res.status(200).json({ message: "Admin logged out successfully" });
  }

   async refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const newAccessToken = await this.adminService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ message: error.message || 'Invalid refresh token' });
  }
}
}