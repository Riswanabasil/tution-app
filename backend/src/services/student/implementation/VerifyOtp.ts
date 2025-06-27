// import { StudentOtpRepository } from "../../../repositories/student/implementation/StudentOtpRepository";
// import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";

// const otpRepo = new StudentOtpRepository();
// const studentRepo = new StudentRepository();

// export const verifyStudentOtpService = async (
//   email: string,
//   otp: string
// ): Promise<string> => {
//   const existingOtp = await otpRepo.findLatestByEmail(email);
//   if (!existingOtp) {
//     throw new Error('No OTP found for this email');
//   }

//   if (existingOtp.expiresAt < new Date()) {
//     throw new Error('OTP has expired');
//   }

//   if (existingOtp.otp !== otp) {
//     throw new Error('Invalid OTP');
//   }

//   await studentRepo.updateIsVerified(email);

//   return 'OTP verified successfully';
// };