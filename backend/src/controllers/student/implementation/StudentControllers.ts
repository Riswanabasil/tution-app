import { Request, Response } from "express";
import { StudentService } from "../../../services/student/implementation/StudentService";
import { IStudentController } from "../IStudentController";
import { AuthenticatedRequest } from "../../../types/Index";
import { IOtpService } from "../../../services/student/IOtpService";
import { OtpService } from "../../../services/common/OtpService";

export class StudentController implements IStudentController {
  constructor(private studentService: StudentService,
    private otpService: IOtpService,
    private commonOtp:OtpService
  ) {}

  async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;

      const { student, token } = await this.studentService.registerStudentService(
        name, email, phone, password
      );

      res.status(201).json({
        message: "Student registered successfully",
        student: {
          id: student._id,
          name: student.name,
          phone: student.phone,
          email: student.email,
          role: student.role,
        },
        token,
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

   async verifyStudentOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
       if (!email) throw new Error("Unauthorized");
      const { otp } = req.body;
      const result = await this.otpService.verifyOtp(email, otp);
      res.status(200).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "OTP verification failed" });
    }
  }

  async resendOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) throw new Error("Unauthorized");

      const result = await this.otpService.resendOtp(email);
      res.status(200).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Resend OTP failed" });
    }
  }
  async loginStudent(req:Request,res:Response):Promise<void>{
      try{
        const {email,password}=req.body
        const {accessToken,refreshToken,student}= await this.studentService.loginStudentService(email,password)
  
        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
  
      res.status(200).json({
        message: 'Login successful',
        accessToken,
        student
      });
      }catch (error: any) {
      res.status(401).json({ message: error.message || 'Login failed' });
    }
    }
  async logoutStudent(req: Request, res: Response): Promise<void> {
     res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
    res.status(200).json({ message: "Student logged out successfully" });
  }

    async refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const newAccessToken = await this.studentService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ message: error.message || 'Invalid refresh token' });
  }
}


async googleLoginStudent(req: Request, res: Response): Promise<void> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'Google ID token missing' });
      return;
    }

    const { accessToken, refreshToken, student } = await this.studentService.googleLoginStudentService(idToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      message: 'Google login successful',
      accessToken,
      student
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Google login failed' });
  }
}

async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.studentService.getProfile(userId);
      res.json({ data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.studentService.updateProfile(userId, req.body);
      res.json({ data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async changePassword(req:AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await this.studentService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.json({ message: "Password updated" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
