'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const studentRepository_1 = require('../repositories/student/implementation/studentRepository');
const StudentService_1 = require('../services/student/implementation/StudentService');
const BcryptHasher_1 = require('../services/common/BcryptHasher');
const OtpService_1 = require('../services/common/OtpService');
const TokenService_1 = require('../services/common/TokenService');
const StudentControllers_1 = require('../controllers/student/implementation/StudentControllers');
const StudentOtpService_1 = require('../services/student/implementation/StudentOtpService');
const StudentOtpRepository_1 = require('../repositories/student/implementation/StudentOtpRepository');
const authMiddleware_1 = require('../middlewares/authMiddleware');
const CourseRepository_1 = require('../repositories/course/implementation/CourseRepository');
const CourseService_1 = require('../services/student/implementation/CourseService');
const CourseController_1 = require('../controllers/student/implementation/CourseController');
const ModuleRepository_1 = require('../repositories/module/implementation/ModuleRepository');
const TutorRepository_1 = require('../repositories/tutor/implementation/TutorRepository');
const EnrollmentRepository_1 = require('../repositories/payment/implementation/EnrollmentRepository');
const PaymentService_1 = require('../services/student/implementation/PaymentService');
const PaymentController_1 = require('../controllers/student/implementation/PaymentController');
const TopicRepository_1 = require('../repositories/topic/implementation/TopicRepository');
const PaidCourseService_1 = require('../services/student/implementation/PaidCourseService');
const PaidCourseController_1 = require('../controllers/student/implementation/PaidCourseController');
const NoteRepository_1 = require('../repositories/note/implementation/NoteRepository');
const AssignmentRepository_1 = require('../repositories/assignment/implementation/AssignmentRepository');
const SubmissionRepository_1 = require('../repositories/submission/implementation/SubmissionRepository');
const StudentAssignmentService_1 = require('../services/student/implementation/StudentAssignmentService');
const AssignmentController_1 = require('../controllers/student/implementation/AssignmentController');
const PasswordResetService_1 = require('../services/student/implementation/PasswordResetService');
const PasswordResetController_1 = require('../controllers/student/implementation/PasswordResetController');
const VideoProgressRepository_1 = require('../repositories/video/implementation/VideoProgressRepository');
const VideoService_1 = require('../services/student/implementation/VideoService');
const VideoController_1 = require('../controllers/student/implementation/VideoController');
const ReviewRepository_1 = require('../repositories/review/implementation/ReviewRepository');
const ReviewService_1 = require('../services/student/implementation/ReviewService');
const reviewController_1 = __importDefault(
  require('../controllers/student/implementation/reviewController'),
);
const LiveSessionRepository_1 = require('../repositories/liveSession/implementation/LiveSessionRepository');
const LiveSessionService_1 = require('../services/student/implementation/LiveSessionService');
const LiveSessionController_1 = require('../controllers/student/implementation/LiveSessionController');
const router = express_1.default.Router();
// Manual Dependency Injection
const studentRepo = new studentRepository_1.StudentRepository();
const hasher = new BcryptHasher_1.BcryptHasher();
const otpService = new OtpService_1.OtpService();
const tokenService = new TokenService_1.TokenService();
const studentOtpRepository = new StudentOtpRepository_1.StudentOtpRepository();
const studentOtpService = new StudentOtpService_1.StudentOtpService(
  studentOtpRepository,
  studentRepo,
);
const enrollRepository = new EnrollmentRepository_1.EnrollmentRepository();
const studentService = new StudentService_1.StudentService(
  studentRepo,
  hasher,
  otpService,
  tokenService,
  enrollRepository,
);
const studentController = new StudentControllers_1.StudentController(
  studentService,
  studentOtpService,
  otpService,
);
const moduleRepo = new ModuleRepository_1.ModuleRepository();
const tutorRepo = new TutorRepository_1.TutorRepository();
const courseRepo = new CourseRepository_1.CourseRepository();
const topicRepo = new TopicRepository_1.TopicRepository();
const courseService = new CourseService_1.StudentCourseService(
  courseRepo,
  moduleRepo,
  tutorRepo,
  topicRepo,
);
const courseController = new CourseController_1.StudentCourseController(courseService);
const paymentRepo = new EnrollmentRepository_1.EnrollmentRepository();
const paymentService = new PaymentService_1.PaymentService(paymentRepo, tutorRepo, courseRepo);
const paymentController = new PaymentController_1.PaymentController(paymentService);
const noteRepo = new NoteRepository_1.NoteRepository();
const paidCourseService = new PaidCourseService_1.PaidCourseService(
  moduleRepo,
  topicRepo,
  noteRepo,
);
const paidCourseController = new PaidCourseController_1.PaidCourseController(paidCourseService);
const assignmentRepo = new AssignmentRepository_1.AssignmentRepository();
const SubmissionRepo = new SubmissionRepository_1.SubmissionRepository();
const assignmentService = new StudentAssignmentService_1.StudentAssignmentService(
  assignmentRepo,
  SubmissionRepo,
);
const assignmentController = new AssignmentController_1.AssignmentController(assignmentService);
const passwordService = new PasswordResetService_1.PasswordResetService(
  studentOtpRepository,
  studentRepo,
  otpService,
);
const passwordController = new PasswordResetController_1.PasswordResetController(passwordService);
const videoRepo = new VideoProgressRepository_1.StudentVideoProgressRepository();
const videoSvc = new VideoService_1.StudentVideoService(videoRepo);
const videoCtrl = new VideoController_1.StudentVideoController(videoSvc);
const reviewRepo = new ReviewRepository_1.ReviewRepository();
const reviewService = new ReviewService_1.ReviewService(reviewRepo);
const reviewCtrl = new reviewController_1.default(reviewService);
const liveRepo = new LiveSessionRepository_1.LiveSessionRepository();
const liveService = new LiveSessionService_1.StudentLiveSessionService(liveRepo);
const liveController = new LiveSessionController_1.StudentLiveSessionController(liveService);
// Route
router.post('/register', studentController.registerStudent.bind(studentController));
router.post(
  '/verify-otp',
  authMiddleware_1.authMiddleware,
  studentController.verifyStudentOtp.bind(studentController),
);
router.post(
  '/resend-otp',
  authMiddleware_1.authMiddleware,
  studentController.resendOtp.bind(studentController),
);
router.post('/login', studentController.loginStudent.bind(studentController));
router.post('/logout', studentController.logoutStudent.bind(studentController));
router.get('/refresh-token', studentController.refreshAccessToken.bind(studentController));
router.post('/google-login', studentController.googleLoginStudent.bind(studentController));
//forgot-password
router.post('/forgot-password', passwordController.forgotPassword.bind(passwordController));
router.post('/verify-reset-otp', passwordController.verifyResetOtp.bind(passwordController));
router.post('/reset-password', passwordController.resetPassword.bind(passwordController));
//profile
router.get(
  '/profile',
  authMiddleware_1.authMiddleware,
  studentController.getProfile.bind(studentController),
);
router.put(
  '/profile',
  authMiddleware_1.authMiddleware,
  studentController.updateProfile.bind(studentController),
);
router.put(
  '/profile/password',
  authMiddleware_1.authMiddleware,
  studentController.changePassword.bind(studentController),
);
router.get('/profile/upload-url', studentController.getUploadUrl);
//course
router.get(
  '/courses',
  authMiddleware_1.authMiddleware,
  courseController.list.bind(courseController),
);
router.get('/courses/:courseId', courseController.getCourseDetails.bind(courseController));
//payment
router.post(
  '/payments/order',
  authMiddleware_1.authMiddleware,
  paymentController.createOrder.bind(paymentController),
);
router.post(
  '/payments/verify',
  authMiddleware_1.authMiddleware,
  paymentController.verifyPayment.bind(paymentController),
);
router.post(
  '/payments/cancel',
  authMiddleware_1.authMiddleware,
  paymentController.cancelPayment.bind(paymentController),
);
router.get(
  '/stats',
  authMiddleware_1.authMiddleware,
  paymentController.getStats.bind(paymentController),
);
router.get(
  '/history',
  authMiddleware_1.authMiddleware,
  paymentController.getHistory.bind(paymentController),
);
router.post(
  '/payments/retry',
  authMiddleware_1.authMiddleware,
  paymentController.retryOrder.bind(paymentController),
);
//paid Course
router.get(
  '/mycourses',
  authMiddleware_1.authMiddleware,
  paymentController.getMyCourses.bind(paymentController),
);
router.get(
  '/modules/:courseId',
  authMiddleware_1.authMiddleware,
  paidCourseController.getModulesByCourse.bind(paidCourseController),
);
router.get(
  '/topics/:moduleId',
  authMiddleware_1.authMiddleware,
  paidCourseController.getTopicsByModule.bind(paidCourseController),
);
router.get(
  '/notes/:topicId',
  authMiddleware_1.authMiddleware,
  paidCourseController.getNotes.bind(paidCourseController),
);
router.get(
  '/assignments/:topicId',
  authMiddleware_1.authMiddleware,
  assignmentController.getAssignmentsForStudent.bind(assignmentController),
);
router.get('/submissions/presigned-url', assignmentController.generatePresignedUrl);
router.post(
  '/submissions/:assignmentId',
  authMiddleware_1.authMiddleware,
  assignmentController.createSubmissionController.bind(assignmentController),
);
router.get(
  '/submissions/:assignmentId',
  authMiddleware_1.authMiddleware,
  assignmentController.getStudentSubmissionByAssignment.bind(assignmentController),
);
router.put(
  '/submission/:assignmentId',
  authMiddleware_1.authMiddleware,
  assignmentController.updateSubmissionByAssignment.bind(assignmentController),
);
//video
router.get(
  '/topics/:topicId/videos',
  authMiddleware_1.authMiddleware,
  videoCtrl.listByTopic.bind(videoCtrl),
);
router.post(
  '/videos/:videoId/progress',
  authMiddleware_1.authMiddleware,
  videoCtrl.upsertProgress.bind(videoCtrl),
);
//review
router.post('/reviews', authMiddleware_1.authMiddleware, reviewCtrl.create.bind(reviewCtrl));
router.get('/reviews/:id', authMiddleware_1.authMiddleware, reviewCtrl.getById.bind(reviewCtrl));
router.get(
  '/courses/:courseId/reviews',
  authMiddleware_1.authMiddleware,
  reviewCtrl.listByCourse.bind(reviewCtrl),
);
router.get(
  '/courses/:courseId/reviews/stats',
  authMiddleware_1.authMiddleware,
  reviewCtrl.stats.bind(reviewCtrl),
);
router.patch('/reviews/:id', authMiddleware_1.authMiddleware, reviewCtrl.update.bind(reviewCtrl));
router.delete('/reviews/:id', authMiddleware_1.authMiddleware, reviewCtrl.remove.bind(reviewCtrl));
router.get(
  '/courses/:courseId/reviews/mine',
  authMiddleware_1.authMiddleware,
  reviewCtrl.getMine.bind(reviewCtrl),
);
//live
router.get(
  '/topic/:topicId/livesession',
  authMiddleware_1.authMiddleware,
  liveController.listByTopic.bind(liveController),
);
router.get(
  '/livesession/:id',
  authMiddleware_1.authMiddleware,
  liveController.getById.bind(liveController),
);
exports.default = router;
