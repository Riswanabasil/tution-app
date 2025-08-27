import StudentOtpSchema from '../../../models/student/StudentOtpSchema';
import { IStudentOtp } from '../../../models/student/StudentOtpSchema';
import { IStudentOtpRepository } from '../IStudentOtpRepository';

export class StudentOtpRepository implements IStudentOtpRepository {
  async findLatestByEmail(email: string): Promise<IStudentOtp | null> {
    return StudentOtpSchema.findOne({ email }).sort({ createdAt: -1 });
  }

  async saveOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
    await StudentOtpSchema.create({ email, otp, expiresAt });
  }
}
