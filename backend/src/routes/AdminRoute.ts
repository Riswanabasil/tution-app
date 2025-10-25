import express from 'express';
import { AdminService } from '../services/admin/implementation/AdminService';
import { AdminController } from '../controllers/admin/AdminControllers';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware';
import { StudentRepository } from '../repositories/student/implementation/studentRepository';
import { StudentAdminService } from '../services//admin/implementation/StudentAdminService';
import { StudentAdminController } from '../controllers/admin/StudentAdminController';
import { TutorRepository } from '../repositories/tutor/implementation/TutorRepository';
import { TutorAdminService } from '../services/admin/implementation/TutorAdminService';
import { TutorAdminController } from '../controllers/admin/TutorAdminController';
import { TokenService } from '../services/common/TokenService';
import { CourseRepository } from '../repositories/course/implementation/CourseRepository';
import { AdminCourseService } from '../services/admin/implementation/CourseService';
import { AdminCourseController } from '../controllers/admin/CourseAdminController';
import { EnrollmentRepository } from '../repositories/payment/implementation/EnrollmentRepository';
import { AdminDashboardService } from '../services/admin/implementation/AdminDashboardService';
import AdminDashboardController from '../controllers/admin/AdminDashboardController';

const router = express.Router();

// DI
const tokenService = new TokenService();
const adminService = new AdminService(tokenService);
const adminController = new AdminController(adminService);
const studentRepo = new StudentRepository();
const studentService = new StudentAdminService(studentRepo);
const studentController = new StudentAdminController(studentService);
const tutorRepo = new TutorRepository();
const tutorService = new TutorAdminService(tutorRepo);
const tutorController = new TutorAdminController(tutorService);
const courseRepo = new CourseRepository();
const courseService = new AdminCourseService(courseRepo, tutorRepo);
const courseController = new AdminCourseController(courseService);
const enrollmentRepo = new EnrollmentRepository();
const dashboardService = new AdminDashboardService(
  studentRepo,
  tutorRepo,
  courseRepo,
  enrollmentRepo,
);
const dashboardController = new AdminDashboardController(dashboardService);

// route
router.post('/login', adminController.loginAdmin.bind(adminController));
router.post('/logout', adminController.logoutAdmin.bind(adminController));
router.get('/refresh-token', adminController.refreshAccessToken.bind(adminController));

//Student
router.get(
  '/students',
  adminAuthMiddleware,
  studentController.getAllStudents.bind(studentController),
);
router.patch(
  '/student/:id/block',
  adminAuthMiddleware,
  studentController.blockStudent.bind(studentController),
);

//tutor
router.get('/tutors', adminAuthMiddleware, tutorController.getAllTutors.bind(tutorController));
router.get('/tutor/:id', adminAuthMiddleware, tutorController.getTutorById.bind(tutorController));
router.patch(
  '/tutor/:id/status',
  adminAuthMiddleware,
  tutorController.updateTutorStatus.bind(tutorController),
);

//course
router.get('/courses',adminAuthMiddleware, courseController.listAll);
router.patch('/courses/:id/status',adminAuthMiddleware, courseController.updateStatus);

//dashboard
router.get('/dashboard/kpis', adminAuthMiddleware, dashboardController.getKpis);
router.get('/dashboard/revenue', adminAuthMiddleware, dashboardController.getRevenueTrend);
router.get('/dashboard/enrollments', adminAuthMiddleware, dashboardController.getEnrollmentTrend);
router.get('/dashboard/top-courses', adminAuthMiddleware, dashboardController.getTopCourses);
router.get(
  '/dashboard/approval-queues',
  adminAuthMiddleware,
  dashboardController.getApprovalQueues,
);

export default router;
