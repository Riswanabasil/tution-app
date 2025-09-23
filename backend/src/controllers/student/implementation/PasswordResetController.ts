import { Request, Response } from 'express';
import { PasswordResetService } from '../../../services/student/implementation/PasswordResetService';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { IPasswordResetService } from '../../../services/student/IPasswordResetService';

export class PasswordResetController {
  constructor(private svc: IPasswordResetService) {}
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
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword, confirmPassword } = req.body;
    try {
      await this.svc.resetWithOtp(email, newPassword, confirmPassword);
      res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
}
