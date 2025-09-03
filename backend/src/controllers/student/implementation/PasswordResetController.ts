import { Request, Response } from 'express';
import { PasswordResetService } from '../../../services/student/implementation/PasswordResetService';
import { HttpStatus } from '../../../constants/statusCode';

export class PasswordResetController {
  constructor(private svc: PasswordResetService) {}
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this.svc.requestReset(email);
    res.status(HttpStatus.OK).json({ message: 'If that email exists, an OTP has been sent.' });
  }
  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    try {
      await this.svc.verifyResetOtp(email, otp);
      res.status(HttpStatus.OK).json({ message: 'OTP verified. You can reset your password now.' });
    } catch (e: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message || 'Invalid OTP' });
    }
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword, confirmPassword } = req.body;
    try {
      await this.svc.resetWithOtp(email, newPassword, confirmPassword);
      res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
    } catch (e: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message || 'Reset failed' });
    }
  }
}
