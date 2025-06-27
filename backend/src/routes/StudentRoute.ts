import express from "express";
import { StudentRepository } from "../repositories/student/implementation/studentRepository";
import { StudentService } from "../services/student/implementation/StudentService";
import { BcryptHasher } from "../services/common/BcryptHasher";
import { OtpService } from "../services/common/OtpService";
import { TokenService } from "../services/common/TokenService";
import { StudentController } from "../controllers/student/implementation/StudentControllers";
import { StudentOtpService } from "../services/student/implementation/StudentOtpService";
import { StudentOtpRepository } from "../repositories/student/implementation/StudentOtpRepository";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();

// Manual Dependency Injection
const studentRepo = new StudentRepository();
const hasher = new BcryptHasher();
const otpService = new OtpService();
const tokenService = new TokenService();
const studentOtpRepository= new StudentOtpRepository()
const studentOtpService= new StudentOtpService(studentOtpRepository,studentRepo)
const studentService = new StudentService(studentRepo, hasher, otpService, tokenService);
const studentController = new StudentController(studentService,studentOtpService);

// Route
router.post('/register', studentController.registerStudent.bind(studentController));
router.post("/verify-otp", authMiddleware, studentController.verifyStudentOtp.bind(studentController));
router.post("/resend-otp", authMiddleware, studentController.resendOtp.bind(studentController));
router.post('/login', studentController.loginStudent.bind(studentController));
router.get('/refresh-token', studentController.refreshAccessToken.bind(studentController))
router.post('/google-login', studentController.googleLoginStudent.bind(studentController) )

export default router;
