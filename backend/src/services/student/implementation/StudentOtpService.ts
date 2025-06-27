import { StudentOtpRepository } from "../../../repositories/student/implementation/StudentOtpRepository";
import { IStudentOtpRepository } from "../../../repositories/student/IStudentOtpRepository";
import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";
import { IStudentRepository } from "../../../repositories/student/IStudentRepository";
import { generateOtp } from "../../../utils/GenerateOtp";
import { sendOtpEmail } from "../../../utils/SendEmail";
import { IOtpService } from "../IOtpService";

export class StudentOtpService implements IOtpService {
  constructor(
    private StudentOtpRepository: IStudentOtpRepository,
    private StudentRepository: IStudentRepository
  ) {}

  async verifyOtp(email: string, otp: string): Promise<string> {
    const existingOtp = await this.StudentOtpRepository.findLatestByEmail(email);
    if (!existingOtp) throw new Error("No OTP found for this email");
    if (existingOtp.expiresAt < new Date()) throw new Error("OTP has expired");
    if (existingOtp.otp !== otp) throw new Error("Invalid OTP");

    await this.StudentRepository.updateIsVerified(email);
    return "OTP verified successfully";
  }

  async resendOtp(email: string): Promise<string> {
    const student = await this.StudentRepository.findByEmail(email);
    if (!student) throw new Error("Student not found");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.StudentOtpRepository.saveOtp(email, otp, expiresAt);
    await sendOtpEmail(email, otp);

    return "OTP resent successfully";
  }
}
