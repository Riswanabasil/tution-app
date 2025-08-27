import { StudentOtpRepository } from '../../../repositories/student/implementation/StudentOtpRepository';
import { StudentRepository } from '../../../repositories/student/implementation/studentRepository';
import bcrypt from 'bcrypt';
import { OtpService } from '../../common/OtpService';

export class PasswordResetService {
  constructor(
    private otpRepo = new StudentOtpRepository(),
    private studentRepo = new StudentRepository(),
    private otpSvc = new OtpService(),
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
