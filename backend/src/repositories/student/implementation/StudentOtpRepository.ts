import StudentOtpSchema from "../../../models/student/StudentOtpSchema";
import { IStudentOtp } from "../../../models/student/StudentOtpSchema";

export class StudentOtpRepository{
    async findLatestByEmail(email: string): Promise<IStudentOtp | null> {
    return StudentOtpSchema.findOne({ email }).sort({ createdAt: -1 });
  }

  async saveOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
  await StudentOtpSchema.create({ email, otp, expiresAt });
}
}