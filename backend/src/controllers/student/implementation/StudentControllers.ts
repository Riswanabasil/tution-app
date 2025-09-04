import { NextFunction, Request, Response } from 'express';
import { StudentService } from '../../../services/student/implementation/StudentService';
import { IStudentController } from '../IStudentController';
import { AuthenticatedRequest } from '../../../types/Index';
import { IOtpService } from '../../../services/student/IOtpService';
import { OtpService } from '../../../services/common/OtpService';
import { presignPutObject } from '../../../utils/s3Presign';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export class StudentController implements IStudentController {
  constructor(
    private studentService: StudentService,
    private otpService: IOtpService,
    private commonOtp: OtpService,
  ) { }

  async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;

      const { student, token } = await this.studentService.registerStudentService(
        name,
        email,
        phone,
        password,
      );

      res.status(HttpStatus.CREATED).json({
        message: 'Student registered successfully',
        student: {
          id: student._id,
          name: student.name,
          phone: student.phone,
          email: student.email,
          role: student.role,
        },
        token,
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async verifyStudentOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) throw new Error('Unauthorized');
      const { otp } = req.body;
      const result = await this.otpService.verifyOtp(email, otp);
      res.status(HttpStatus.OK).json({ message: result });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async resendOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) throw new Error('Unauthorized');

      const result = await this.otpService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: result });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
  async loginStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, student } = await this.studentService.loginStudentService(
        email,
        password,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({
        message: 'Login successful',
        accessToken,
        student,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  }
  async logoutStudent(req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(HttpStatus.OK).json({ message: 'Student logged out successfully' });
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token provided' });
        return;
      }

      const newAccessToken = await this.studentService.refreshAccessToken(refreshToken);

      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({ message: ERROR_MESSAGES.FORBIDDEN });
    }
  }

  async googleLoginStudent(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Google ID token missing' });
        return;
      }
      const REFRESH_COOKIE = Number(process.env.MAX_AGE)
      const { accessToken, refreshToken, student } =
        await this.studentService.googleLoginStudentService(idToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        message: 'Google login successful',
        accessToken,
        student,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.studentService.getProfile(userId);
      res.json({ data });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async getUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'studentPic', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.studentService.updateProfile(userId, req.body);
      res.json({ data });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await this.studentService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password updated' });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
}
