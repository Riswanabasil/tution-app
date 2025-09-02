import { IOtpService } from '../../interfaces/common/IOtpService';
import StudentOtpSchema from '../../models/student/StudentOtpSchema';
import { generateOtp } from '../../utils/GenerateOtp';
import { sendOtpEmail } from '../../utils/SendEmail';

export class OtpService implements IOtpService {
  async generateAndSendOtp(email: string): Promise<string> {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await StudentOtpSchema.create({ email, otp, expiresAt });
    await sendOtpEmail(email, otp);
    return otp;
  }
}
