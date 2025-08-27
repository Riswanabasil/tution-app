import { IStudentOtp } from '../../models/student/StudentOtpSchema';

export interface IStudentOtpRepository {
  findLatestByEmail(email: string): Promise<IStudentOtp | null>;
  saveOtp(email: string, otp: string, expiresAt: Date): Promise<void>;
}
