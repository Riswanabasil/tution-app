import { IStudentController } from "../IstudentController";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StudentService } from "../../../services/student/implementation/registerStudent.service";
import { generateAndSaveOtp } from "../../../services/student/implementation/GenerateOtp.service";
import { verifyStudentOtpService } from "../../../services/student/implementation/VerifyOtp";
import { AuthenticatedRequest } from "../../../types/express";
import { resendOtpService } from "../../../services/student/implementation/ResendOtp.service";
import { loginStudentService } from "../../../services/student/implementation/LoginStudent.service";
import { refreshTokenService } from "../../../services/student/implementation/RefreshToken.service";
import { googleLoginStudentService } from "../../../services/student/implementation/googleLoginStudent.service";
const studentService = new StudentService();

export class StudentController implements IStudentController {
  async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;
      const newStudent = await studentService.registerStudentService(
        name,
        email,
        phone,
        password
      );

      await generateAndSaveOtp(email);

      const token = jwt.sign(
        { id: newStudent._id, role: newStudent.role, email: newStudent.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "Student registered successfully",
        student: {
          id: newStudent._id,
          name: newStudent.name,
          phone: newStudent.phone,
          email: newStudent.email,
          role: newStudent.role,
        },
        token,
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  async verifyStudentOtp(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = (req as any).user;
      const { otp } = req.body;

      const result = await verifyStudentOtpService(user.email, otp);

      res.status(200).json({ message: result });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.message || "OTP verification failed" });
    }
  }

  async resendOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) throw new Error("Unauthorized");
      const result = await resendOtpService(email);
      res.status(200).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Resend OTP failed" });
    }
  }

  async loginStudent(req:Request,res:Response):Promise<void>{
    try{
      const {email,password}=req.body
      const {accessToken,refreshToken,student}= await loginStudentService(email,password)

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

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const newAccessToken = refreshTokenService(refreshToken);

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

    const { accessToken, refreshToken, student } = await googleLoginStudentService(idToken);

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

}
