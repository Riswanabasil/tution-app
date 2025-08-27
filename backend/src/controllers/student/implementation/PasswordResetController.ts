import { Request, Response } from 'express';
import { PasswordResetService } from '../../../services/student/implementation/PasswordResetService';

export class PasswordResetController {
  constructor(private svc = new PasswordResetService()) {}
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this.svc.requestReset(email);
    res.status(200).json({ message: 'If that email exists, an OTP has been sent.' });
  }
  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    try {
      await this.svc.verifyResetOtp(email, otp);
      res.status(200).json({ message: 'OTP verified. You can reset your password now.' });
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Invalid OTP' });
    }
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword, confirmPassword } = req.body;
    try {
      await this.svc.resetWithOtp(email, newPassword, confirmPassword);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Reset failed' });
    }
  }
}
