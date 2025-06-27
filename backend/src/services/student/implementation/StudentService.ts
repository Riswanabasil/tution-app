import { OAuth2Client } from "google-auth-library";
import { IStudentRepository } from "../../../repositories/student/IStudentRepository";
import { IStudent } from "../../../models/student/studentSchema";
import { IHasher } from "../../../interfaces/common/IHasher";
import { OtpService } from "../../common/OtpService";
import { TokenService } from "../../common/TokenService";
import { IStudentService } from "../IStudentService";
import { generateAccessToken, generateRefreshToken } from "../../../utils/GenerateToken";

export class StudentService implements IStudentService {
  constructor(
    private studentRepo: IStudentRepository,
    private hasher: IHasher,
    private otpService: OtpService,
    private tokenService: TokenService
  ) {}

  async registerStudentService(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ student: IStudent; token: string }> {
    const existing = await this.studentRepo.findByEmail(email);
    if (existing) throw new Error("Student already exists");

    const hashedPassword = await this.hasher.hash(password);

    const newStudent = await this.studentRepo.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await this.otpService.generateAndSendOtp(email);

    const token = this.tokenService.generateToken({
      id: newStudent._id,
      email: newStudent.email,
      role: newStudent.role,
    });

    return { student: newStudent, token };
  }

async loginStudentService (email:string,password:string){
    const student =await this.studentRepo.findByEmail(email)
    if(!student){
        throw new Error('Student not found');
    }

    if (!student.isVerified) {
    throw new Error('Please verify your email before logging in');
  }
  if(student.isBlocked){
    throw new Error('Your account blocked');
  }
  const isMatch = await this.hasher.compare(password, student.password);

   if (!isMatch) {
    throw new Error('Invalid password');
  }

  const accessToken = generateAccessToken(student._id.toString(), student.email, student.role);

  const refreshToken=generateRefreshToken(student._id.toString(),student.email,student.role)

  return {
    accessToken,
    refreshToken,
    student: {
      id: student._id,
      email: student.email,
      name: student.name
    }
  };
}

async refreshAccessToken(refreshToken: string): Promise<string> {
  return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
}


async googleLoginStudentService(idToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  student: {
    id: string;
    email: string;
    name: string;
  };
}> {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.name) {
    throw new Error("Invalid Google token");
  }

  const { email, name } = payload;

  let student = await this.studentRepo.findByEmail(email);

  if (!student) {
    student = await this.studentRepo.create({
      name,
      email,
      password: "", // since it's Google signup
      phone: "",
      isGoogleSignup: true,
      isVerified: true,
      role: "student",
    });
  }

  const accessToken = generateAccessToken(
    student._id.toString(),
    student.email,
    student.role
  );

  const refreshToken = generateRefreshToken(
    student._id.toString(),
    student.email,
    student.role
  );

  return {
    accessToken,
    refreshToken,
    student: {
      id: student._id,
      email: student.email,
      name: student.name,
    },
  };
}

}
