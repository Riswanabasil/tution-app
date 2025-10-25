'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const AdminService_1 = require('../services/admin/implementation/AdminService');
const AdminControllers_1 = require('../controllers/admin/AdminControllers');
const adminAuthMiddleware_1 = require('../middlewares/adminAuthMiddleware');
const studentRepository_1 = require('../repositories/student/implementation/studentRepository');
const StudentAdminService_1 = require('../services//admin/implementation/StudentAdminService');
const StudentAdminController_1 = require('../controllers/admin/StudentAdminController');
const TutorRepository_1 = require('../repositories/tutor/implementation/TutorRepository');
const TutorAdminService_1 = require('../services/admin/implementation/TutorAdminService');
const TutorAdminController_1 = require('../controllers/admin/TutorAdminController');
const TokenService_1 = require('../services/common/TokenService');
const CourseRepository_1 = require('../repositories/course/implementation/CourseRepository');
const CourseService_1 = require('../services/admin/implementation/CourseService');
const CourseAdminController_1 = require('../controllers/admin/CourseAdminController');
const EnrollmentRepository_1 = require('../repositories/payment/implementation/EnrollmentRepository');
const AdminDashboardService_1 = require('../services/admin/implementation/AdminDashboardService');
const AdminDashboardController_1 = __importDefault(
  require('../controllers/admin/AdminDashboardController'),
);
const router = express_1.default.Router();
// DI
const tokenService = new TokenService_1.TokenService();
const adminService = new AdminService_1.AdminService(tokenService);
const adminController = new AdminControllers_1.AdminController(adminService);
const studentRepo = new studentRepository_1.StudentRepository();
const studentService = new StudentAdminService_1.StudentAdminService(studentRepo);
const studentController = new StudentAdminController_1.StudentAdminController(studentService);
const tutorRepo = new TutorRepository_1.TutorRepository();
const tutorService = new TutorAdminService_1.TutorAdminService(tutorRepo);
const tutorController = new TutorAdminController_1.TutorAdminController(tutorService);
const courseRepo = new CourseRepository_1.CourseRepository();
const courseService = new CourseService_1.AdminCourseService(courseRepo, tutorRepo);
const courseController = new CourseAdminController_1.AdminCourseController(courseService);
const enrollmentRepo = new EnrollmentRepository_1.EnrollmentRepository();
const dashboardService = new AdminDashboardService_1.AdminDashboardService(
  studentRepo,
  tutorRepo,
  courseRepo,
  enrollmentRepo,
);
const dashboardController = new AdminDashboardController_1.default(dashboardService);
// route
router.post('/login', adminController.loginAdmin.bind(adminController));
router.post('/logout', adminController.logoutAdmin.bind(adminController));
router.get('/refresh-token', adminController.refreshAccessToken.bind(adminController));
//Student
router.get(
  '/students',
  adminAuthMiddleware_1.adminAuthMiddleware,
  studentController.getAllStudents.bind(studentController),
);
router.patch(
  '/student/:id/block',
  adminAuthMiddleware_1.adminAuthMiddleware,
  studentController.blockStudent.bind(studentController),
);
//tutor
router.get(
  '/tutors',
  adminAuthMiddleware_1.adminAuthMiddleware,
  tutorController.getAllTutors.bind(tutorController),
);
router.get(
  '/tutor/:id',
  adminAuthMiddleware_1.adminAuthMiddleware,
  tutorController.getTutorById.bind(tutorController),
);
router.patch(
  '/tutor/:id/status',
  adminAuthMiddleware_1.adminAuthMiddleware,
  tutorController.updateTutorStatus.bind(tutorController),
);
//course
router.get('/courses', courseController.listAll);
router.patch('/courses/:id/status', courseController.updateStatus);
//dashboard
router.get(
  '/dashboard/kpis',
  adminAuthMiddleware_1.adminAuthMiddleware,
  dashboardController.getKpis,
);
router.get(
  '/dashboard/revenue',
  adminAuthMiddleware_1.adminAuthMiddleware,
  dashboardController.getRevenueTrend,
);
router.get(
  '/dashboard/enrollments',
  adminAuthMiddleware_1.adminAuthMiddleware,
  dashboardController.getEnrollmentTrend,
);
router.get(
  '/dashboard/top-courses',
  adminAuthMiddleware_1.adminAuthMiddleware,
  dashboardController.getTopCourses,
);
router.get(
  '/dashboard/approval-queues',
  adminAuthMiddleware_1.adminAuthMiddleware,
  dashboardController.getApprovalQueues,
);
exports.default = router;
