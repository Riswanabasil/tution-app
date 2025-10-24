import { OAuth2Client } from 'google-auth-library';
import { IStudentRepository } from '../../../repositories/student/IStudentRepository';
import { IStudent } from '../../../models/student/studentSchema';
import { IHasher } from '../../../interfaces/common/IHasher';
import { OtpService } from '../../common/OtpService';
import { TokenService } from '../../common/TokenService';
import { IStudentService } from '../IStudentService';
import { generateAccessToken, generateRefreshToken } from '../../../utils/GenerateToken';
import { IEnrollmentRepository } from '../../../repositories/payment/IEnrollmentRepository';
import bcrypt from 'bcrypt';
import { IOtpService } from '../../../interfaces/common/IOtpService';
import { ITokenService } from '../../../interfaces/common/ITokenService';
import { StudentMapper } from '../../../mappers/student/profile';

export class StudentService implements IStudentService {
  constructor(
    private studentRepo: IStudentRepository,
    private hasher: IHasher,
    private otpService: IOtpService,
    private tokenService: ITokenService,
    private enrollRepo: IEnrollmentRepository,
  ) {}

  async registerStudentService(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ student: IStudent; token: string }> {
    const existing = await this.studentRepo.findByEmail(email);
    if (existing) {
      throw new Error('Student already exists');
    }

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

  async loginStudentService(email: string, password: string) {
    const student = await this.studentRepo.findByEmail(email);
    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.isVerified) {
      throw new Error('Please verify your email before logging in');
    }
    if (student.isBlocked) {
      throw new Error('Your account blocked');
    }
    const isMatch = await this.hasher.compare(password, student.password);

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken(student._id.toString(), student.email, student.role,student.name);

    const refreshToken = generateRefreshToken(student._id.toString(), student.email, student.role);

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
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      throw new Error('Invalid Google token');
    }

    const { email, name } = payload;
    let student = await this.studentRepo.findByEmail(email);
    if (!student) {
      student = await this.studentRepo.create({
        name,
        email,
        password: '',
        phone: '',
        isGoogleSignup: true,
        isVerified: true,
        role: 'student',
      });
    }
    const accessToken = generateAccessToken(student._id.toString(), student.email, student.role);
    const refreshToken = generateRefreshToken(student._id.toString(), student.email, student.role);
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

  async getProfile(userId: string) {
    const student = await this.studentRepo.findById(userId);
    if (!student) throw new Error('Student not found');
    // return student;

    const dto = StudentMapper.toProfileDTO(student);
  return dto;
  }

  /** Update phone or profilePic */
  // async updateProfile(
  //   userId: string,
  //   updates: Partial<{ phone: string; profilePic: string }>
  // ) {
  //   const updated = await this.studentRepo.updateById(userId, updates);
  //   if (!updated) throw new Error("Failed to update profile");
  //   return updated;
  // }

  /** Verify currentPassword, then change to newPassword */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const student = await this.studentRepo.findById(userId);
    if (!student) throw new Error('Student not found');

    const match = await bcrypt.compare(currentPassword, (student as any).password);
    if (!match) throw new Error('Current password is incorrect');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.studentRepo.changePassword(userId, hash);
  }

  async updateProfile(userId: string, updates: { name?: string; phone?: string; profilePicKey?: string }) {
    let finalPic: string | undefined;
    if (updates.profilePicKey) {
      finalPic =
        `https://${process.env.S3_BUCKET_NAME!}.s3.amazonaws.com/` +
        encodeURIComponent(updates.profilePicKey);
    }
    const toSave: any = { ...(updates.phone && { phone: updates.phone }) };
    if (finalPic) toSave.profilePic = finalPic;
toSave.name = updates.name
    const updated = await this.studentRepo.updateById(userId, toSave);
    if (!updated) throw new Error('Failed to update profile');
    return updated;
  }
}
