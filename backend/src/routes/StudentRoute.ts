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
import { CourseRepository } from "../repositories/course/implementation/CourseRepository";
import { StudentCourseService } from "../services/student/implementation/CourseService";
import { StudentCourseController } from "../controllers/student/implementation/CourseController";
import { ModuleRepository } from "../repositories/module/implementation/ModuleRepository";
import { TutorRepository } from "../repositories/tutor/implementation/TutorRepository";
import { EnrollmentRepository } from "../repositories/payment/implementation/EnrollmentRepository";
import { PaymentService } from "../services/student/implementation/PaymentService";
import { PaymentController } from "../controllers/student/implementation/PaymentController";
import { getUploadUrl } from "../controllers/student/implementation/Upload.controller";
import { TopicRepository } from "../repositories/topic/implementation/TopicRepository";



const router = express.Router();

// Manual Dependency Injection
const studentRepo = new StudentRepository();
const hasher = new BcryptHasher();
const otpService = new OtpService();
const tokenService = new TokenService();
const studentOtpRepository= new StudentOtpRepository()
const studentOtpService= new StudentOtpService(studentOtpRepository,studentRepo)
const enrollRepository= new EnrollmentRepository()
const studentService = new StudentService(studentRepo, hasher, otpService, tokenService,enrollRepository);
const studentController = new StudentController(studentService,studentOtpService);
const moduleRepo=new ModuleRepository()
const tutorRepo=new TutorRepository()
const courseRepo= new CourseRepository()
const topicRepo= new TopicRepository
const courseService=new StudentCourseService(courseRepo,moduleRepo,tutorRepo,topicRepo)
const courseController= new StudentCourseController(courseService)
const paymentRepo=new EnrollmentRepository()
const paymentService= new PaymentService(paymentRepo,tutorRepo,courseRepo)
const paymentController= new PaymentController(paymentService)

// Route
router.post('/register', studentController.registerStudent.bind(studentController));
router.post("/verify-otp", authMiddleware, studentController.verifyStudentOtp.bind(studentController));
router.post("/resend-otp", authMiddleware, studentController.resendOtp.bind(studentController));
router.post('/login', studentController.loginStudent.bind(studentController));
router.get('/refresh-token', studentController.refreshAccessToken.bind(studentController))
router.post('/google-login', studentController.googleLoginStudent.bind(studentController) )

//profile

router.get(  "/profile", authMiddleware, studentController.getProfile.bind(studentController));
router.put(  "/profile", authMiddleware, studentController.updateProfile.bind(studentController));
router.put(  "/profile/password", authMiddleware, studentController.changePassword.bind(studentController));
router.get("/profile/upload-url", getUploadUrl)
//course

router.get("/courses",authMiddleware,courseController.list.bind(courseController));
router.get('/courses/:courseId',courseController.getCourseDetails.bind(courseController))


//payment

router.post("/payments/order",authMiddleware,paymentController.createOrder.bind(paymentController));
router.post("/payments/verify",authMiddleware,paymentController.verifyPayment.bind(paymentController));
router.post("/payments/cancel", authMiddleware,paymentController.cancelPayment.bind(paymentController))
router.get( "/stats",   authMiddleware, paymentController.getStats.bind(paymentController));
router.get( "/history", authMiddleware, paymentController.getHistory.bind(paymentController));
router.post("/payments/retry",authMiddleware,paymentController.retryOrder.bind(paymentController))

//paid Course

router.get(
  "/mycourses",authMiddleware,paymentController.getMyCourses.bind(paymentController));



export default router;
