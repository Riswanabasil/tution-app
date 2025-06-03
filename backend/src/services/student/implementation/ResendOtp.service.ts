import { StudentOtpRepository } from "../../../repositories/student/implementation/StudentOtpRepository";
import { StudentRepository } from "../../../repositories/student/implementation/studentRepository";
import { generateOtp } from "../../../utils/GenerateOtp";
import { sendOtpEmail } from "../../../utils/SendEmail";


const otpRepo= new StudentOtpRepository
const studentRepo= new StudentRepository

export const resendOtpService=async (email:string):Promise<string>=>{
    const student= studentRepo.findByEmail(email)

    if(!student){
        throw new Error('Student not found');
    }

    const otp=generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

     await otpRepo.saveOtp(email, otp, expiresAt);
     await sendOtpEmail(email,otp)

     return 'OTP resent successfully';
    
}


