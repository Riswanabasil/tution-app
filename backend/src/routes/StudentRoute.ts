import express from 'express';
import { StudentRepository } from '../repositories/student/implementation/studentRepository';
import { StudentService } from '../services/student/implementation/StudentService';
import { BcryptHasher } from '../services/common/BcryptHasher';
import { OtpService } from '../services/common/OtpService';
import { TokenService } from '../services/common/TokenService';
import { StudentController } from '../controllers/student/implementation/StudentControllers';
import { StudentOtpService } from '../services/student/implementation/StudentOtpService';
import { StudentOtpRepository } from '../repositories/student/implementation/StudentOtpRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { CourseRepository } from '../repositories/course/implementation/CourseRepository';
import { StudentCourseService } from '../services/student/implementation/CourseService';
import { StudentCourseController } from '../controllers/student/implementation/CourseController';
import { ModuleRepository } from '../repositories/module/implementation/ModuleRepository';
import { TutorRepository } from '../repositories/tutor/implementation/TutorRepository';
import { EnrollmentRepository } from '../repositories/payment/implementation/EnrollmentRepository';
import { PaymentService } from '../services/student/implementation/PaymentService';
import { PaymentController } from '../controllers/student/implementation/PaymentController';
import { TopicRepository } from '../repositories/topic/implementation/TopicRepository';
import { PaidCourseService } from '../services/student/implementation/PaidCourseService';
import { PaidCourseController } from '../controllers/student/implementation/PaidCourseController';
import { NoteRepository } from '../repositories/note/implementation/NoteRepository';
import { AssignmentRepository } from '../repositories/assignment/implementation/AssignmentRepository';
import { SubmissionRepository } from '../repositories/submission/implementation/SubmissionRepository';
import { StudentAssignmentService } from '../services/student/implementation/StudentAssignmentService';
import { AssignmentController } from '../controllers/student/implementation/AssignmentController';
import { PasswordResetService } from '../services/student/implementation/PasswordResetService';
import { PasswordResetController } from '../controllers/student/implementation/PasswordResetController';
import { StudentVideoProgressRepository } from '../repositories/video/implementation/VideoProgressRepository';
import { StudentVideoService } from '../services/student/implementation/VideoService';
import { StudentVideoController } from '../controllers/student/implementation/VideoController';
import { ReviewRepository } from '../repositories/review/implementation/ReviewRepository';
import { ReviewService } from '../services/student/implementation/ReviewService';
import ReviewController from '../controllers/student/implementation/reviewController';
import { LiveSessionRepository } from '../repositories/liveSession/implementation/LiveSessionRepository';
import { StudentLiveSessionService } from '../services/student/implementation/LiveSessionService';
import { StudentLiveSessionController } from '../controllers/student/implementation/LiveSessionController';

const router = express.Router();

// Manual Dependency Injection
const studentRepo = new StudentRepository();
const hasher = new BcryptHasher();
const otpService = new OtpService();
const tokenService = new TokenService();
const studentOtpRepository = new StudentOtpRepository();
const studentOtpService = new StudentOtpService(studentOtpRepository, studentRepo);
const enrollRepository = new EnrollmentRepository();
const studentService = new StudentService(
  studentRepo,
  hasher,
  otpService,
  tokenService,
  enrollRepository,
);
const studentController = new StudentController(studentService, studentOtpService, otpService);
const moduleRepo = new ModuleRepository();
const tutorRepo = new TutorRepository();
const courseRepo = new CourseRepository();
const topicRepo = new TopicRepository();
const courseService = new StudentCourseService(courseRepo, moduleRepo, tutorRepo, topicRepo);
const courseController = new StudentCourseController(courseService);
const paymentRepo = new EnrollmentRepository();
const paymentService = new PaymentService(paymentRepo, tutorRepo, courseRepo);
const paymentController = new PaymentController(paymentService);
const noteRepo = new NoteRepository();
const paidCourseService = new PaidCourseService(moduleRepo, topicRepo, noteRepo);
const paidCourseController = new PaidCourseController(paidCourseService);
const assignmentRepo = new AssignmentRepository();
const SubmissionRepo = new SubmissionRepository();
const assignmentService = new StudentAssignmentService(assignmentRepo, SubmissionRepo);
const assignmentController = new AssignmentController(assignmentService);
const passwordService = new PasswordResetService(studentOtpRepository, studentRepo, otpService);
const passwordController = new PasswordResetController(passwordService);
const videoRepo = new StudentVideoProgressRepository();
const videoSvc = new StudentVideoService(videoRepo);
const videoCtrl = new StudentVideoController(videoSvc);
const reviewRepo = new ReviewRepository();
const reviewService = new ReviewService(reviewRepo);
const reviewCtrl = new ReviewController(reviewService);

const liveRepo = new LiveSessionRepository();
const liveService = new StudentLiveSessionService(liveRepo);
const liveController = new StudentLiveSessionController(liveService);
// Route
router.post('/register', studentController.registerStudent.bind(studentController));
router.post(
  '/verify-otp',
  authMiddleware,
  studentController.verifyStudentOtp.bind(studentController),
);
router.post('/resend-otp', authMiddleware, studentController.resendOtp.bind(studentController));
router.post('/login', studentController.loginStudent.bind(studentController));
router.post('/logout', studentController.logoutStudent.bind(studentController));
router.get('/refresh-token', studentController.refreshAccessToken.bind(studentController));
router.post('/google-login', studentController.googleLoginStudent.bind(studentController));
//forgot-password
router.post('/forgot-password', passwordController.forgotPassword.bind(passwordController));
router.post('/verify-reset-otp', passwordController.verifyResetOtp.bind(passwordController));
router.post('/reset-password', passwordController.resetPassword.bind(passwordController));

//profile

router.get('/profile', authMiddleware, studentController.getProfile.bind(studentController));
router.put('/profile', authMiddleware, studentController.updateProfile.bind(studentController));
router.put(
  '/profile/password',
  authMiddleware,
  studentController.changePassword.bind(studentController),
);
router.get('/profile/upload-url', studentController.getUploadUrl);
//course

router.get('/courses', authMiddleware, courseController.list.bind(courseController));
router.get('/courses/:courseId', courseController.getCourseDetails.bind(courseController));

//payment

router.post(
  '/payments/order',
  authMiddleware,
  paymentController.createOrder.bind(paymentController),
);
router.post(
  '/payments/verify',
  authMiddleware,
  paymentController.verifyPayment.bind(paymentController),
);
router.post(
  '/payments/cancel',
  authMiddleware,
  paymentController.cancelPayment.bind(paymentController),
);
router.get('/stats', authMiddleware, paymentController.getStats.bind(paymentController));
router.get('/history', authMiddleware, paymentController.getHistory.bind(paymentController));
router.post(
  '/payments/retry',
  authMiddleware,
  paymentController.retryOrder.bind(paymentController),
);

//paid Course

router.get('/mycourses', authMiddleware, paymentController.getMyCourses.bind(paymentController));
router.get(
  '/modules/:courseId',
  authMiddleware,
  paidCourseController.getModulesByCourse.bind(paidCourseController),
);
router.get(
  '/topics/:moduleId',
  authMiddleware,
  paidCourseController.getTopicsByModule.bind(paidCourseController),
);
router.get(
  '/notes/:topicId',
  authMiddleware,
  paidCourseController.getNotes.bind(paidCourseController),
);
router.get(
  '/assignments/:topicId',
  authMiddleware,
  assignmentController.getAssignmentsForStudent.bind(assignmentController),
);
router.get('/submissions/presigned-url', assignmentController.generatePresignedUrl);
router.post(
  '/submissions/:assignmentId',
  authMiddleware,
  assignmentController.createSubmissionController.bind(assignmentController),
);
router.get(
  '/submissions/:assignmentId',
  authMiddleware,
  assignmentController.getStudentSubmissionByAssignment.bind(assignmentController),
);
router.put(
  '/submission/:assignmentId',
  authMiddleware,
  assignmentController.updateSubmissionByAssignment.bind(assignmentController),
);

//video
router.get('/topics/:topicId/videos', authMiddleware, videoCtrl.listByTopic.bind(videoCtrl));
router.post('/videos/:videoId/progress', authMiddleware, videoCtrl.upsertProgress.bind(videoCtrl));

//review
router.post('/reviews', authMiddleware, reviewCtrl.create.bind(reviewCtrl));
router.get('/reviews/:id', authMiddleware, reviewCtrl.getById.bind(reviewCtrl));
router.get('/courses/:courseId/reviews', authMiddleware, reviewCtrl.listByCourse.bind(reviewCtrl));
router.get('/courses/:courseId/reviews/stats', authMiddleware, reviewCtrl.stats.bind(reviewCtrl));
router.patch('/reviews/:id', authMiddleware, reviewCtrl.update.bind(reviewCtrl));
router.delete('/reviews/:id', authMiddleware, reviewCtrl.remove.bind(reviewCtrl));
router.get('/courses/:courseId/reviews/mine', authMiddleware, reviewCtrl.getMine.bind(reviewCtrl));

//live
router.get(
  '/topic/:topicId/livesession',
  authMiddleware,              
  liveController.listByTopic.bind(liveController)
);


router.get(
  '/livesession/:id',
  authMiddleware,
  liveController.getById.bind(liveController)
);

export default router;
