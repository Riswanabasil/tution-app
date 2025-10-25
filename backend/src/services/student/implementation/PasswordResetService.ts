import bcrypt from 'bcrypt';
import { IStudentOtpRepository } from '../../../repositories/student/IStudentOtpRepository';
import { IStudentRepository } from '../../../repositories/student/IStudentRepository';
import { IOtpService } from '../../../interfaces/common/IOtpService';
import { IPasswordResetService } from '../IPasswordResetService';

export class PasswordResetService implements IPasswordResetService {
  constructor(
    private otpRepo: IStudentOtpRepository,
    private studentRepo: IStudentRepository,
    private otpSvc: IOtpService,
  ) {}

  async requestReset(email: string): Promise<void> {
    const user = await this.studentRepo.findByEmail(email);
    if (user) await this.otpSvc.generateAndSendOtp(email);
  }

  async verifyResetOtp(email: string, otp: string): Promise<void> {
    const latest = await this.otpRepo.findLatestByEmail(email);
    if (!latest) throw new Error('Invalid OTP');
    if (latest.expiresAt < new Date()) throw new Error('OTP expired');
    if (latest.otp !== otp) throw new Error('Invalid OTP');
  }

  async resetWithOtp(email: string, newPassword: string, confirmPassword: string): Promise<void> {
    if (!newPassword || newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const user = await this.studentRepo.findByEmail(email);
    if (!user) throw new Error('Account not found');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.studentRepo.updatePasswordByEmail(email, hash);
  }
}
