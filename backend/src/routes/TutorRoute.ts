import express from 'express';
import { TutorRepository } from '../repositories/tutor/implementation/TutorRepository';
import { BcryptHasher } from '../services/common/BcryptHasher';
import { TutorService } from '../services/tutor/implementation/TutorService';
import { TutorController } from '../controllers/tutor/implementation/TutorControllers';
import { uploadTutorDocs } from '../middlewares/uploadTutorDocs';
import { TokenService } from '../services/common/TokenService';
import { CourseRepository } from '../repositories/course/implementation/CourseRepository';
import { TutorCourseService } from '../services/tutor/implementation/TutorCourseService';
import { TutorCourseController } from '../controllers/tutor/implementation/TutorCourseController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ModuleRepository } from '../repositories/module/implementation/ModuleRepository';
import { TutorModuleService } from '../services/tutor/implementation/ModuleService';
import { ModuleController } from '../controllers/tutor/implementation/ModuleController';
//topic
import { TopicRepository } from '../repositories/topic/implementation/TopicRepository';
import { TopicService } from '../services/tutor/implementation/TopicService';
import { TopicController } from '../controllers/tutor/implementation/TopicController';
//note
import { NoteRepository } from '../repositories/note/implementation/NoteRepository';
import { NoteService } from '../services/tutor/implementation/NoteService';
import { NoteController } from '../controllers/tutor/implementation/NoteController';
//assignment
import { AssignmentRepository } from '../repositories/assignment/implementation/AssignmentRepository';
import { AssignmentService } from '../services/tutor/implementation/AssignmentService';
import { AssignmentController } from '../controllers/tutor/implementation/AssignmentController';
import { VideoRepository } from '../repositories/video/implementation/VideoRepository';
import { VideoService } from '../services/tutor/implementation/VideoService';
import { VideoController } from '../controllers/tutor/implementation/VideoController';
import { EnrollmentRepository } from '../repositories/payment/implementation/EnrollmentRepository';
import { AdminDashboardService } from '../services/admin/implementation/AdminDashboardService';
import { TutorDashboardService } from '../services/tutor/implementation/DashboardService';
import { TutorDashboardController } from '../controllers/tutor/implementation/DashboardController';
import { getNoteUploadUrls } from '../controllers/tutor/implementation/upload.controller';

const router = express.Router();

const tutorRepo = new TutorRepository();
const hasher = new BcryptHasher();
const tokenService = new TokenService();
const tutorService = new TutorService(tutorRepo, hasher, tokenService);
const tutorController = new TutorController(tutorService);
const courseRepo = new CourseRepository();
const courseService = new TutorCourseService(courseRepo);
const courseController = new TutorCourseController(courseService);
const moduleRepo = new ModuleRepository();
const moduleService = new TutorModuleService(moduleRepo);
const moduleController = new ModuleController(moduleService);
//topic
const topicRepo = new TopicRepository();
const topicService = new TopicService(topicRepo);
const topicController = new TopicController(topicService);
//note
const noteRepo = new NoteRepository();
const noteService = new NoteService(noteRepo);
const noteController = new NoteController(noteService);
//assignment
const assRepo = new AssignmentRepository();
const assService = new AssignmentService(assRepo, topicRepo, moduleRepo, courseRepo);
const assController = new AssignmentController(assService);
//video

const videoRepo = new VideoRepository();
const videoService = new VideoService(videoRepo);
const videoCtrl = new VideoController(videoService);

//dashboard
const enrollmentRepo = new EnrollmentRepository();
const enrollmentService = new TutorDashboardService(courseRepo, enrollmentRepo, tutorRepo);
const enrollmentController = new TutorDashboardController(enrollmentService);

router.post('/register', tutorController.registerTutor.bind(tutorController));
router.post(
  '/submit-verification',
  uploadTutorDocs,
  tutorController.submitTutorVerification.bind(tutorController),
);
router.post('/login', tutorController.loginTutor.bind(tutorController));
router.post('/logout', tutorController.logoutTutor.bind(tutorController));
router.post('/google-login',tutorController.googleLoginTutor.bind(tutorController))
router.get('/refresh-token', tutorController.refreshAccessToken.bind(tutorController));

//profile

router.get('/profile', authMiddleware, tutorController.getProfile.bind(tutorController));
router.put('/profile', authMiddleware, tutorController.updateProfile.bind(tutorController));
router.put(
  '/profile/password',
  authMiddleware,
  tutorController.changePassword.bind(tutorController),
);
router.get('/profile/stats', authMiddleware, tutorController.getStats.bind(tutorController));
router.get('/profile/courses', authMiddleware, tutorController.getMyCourses.bind(tutorController));
router.get('/profile/upload-url', tutorController.getProfileUploadUrl);

//course

router.post('/course', authMiddleware, courseController.createCourse.bind(courseController));
router.get('/courses', authMiddleware, courseController.getAllCourses.bind(courseController));
router.get('/course/:id', courseController.getCourseById.bind(courseController));
router.put('/course/:id', courseController.updateCourse.bind(courseController));
router.delete('/course/:id', courseController.softDeleteCourse.bind(courseController));
router.get('/courses/upload-url', courseController.getUploadUrl);
router.get('/courses/demo-upload-url', courseController.getDemoUploadUrl);
router.patch(
  '/courses/:id/reapply',
  authMiddleware,
  courseController.reapplyCourse.bind(courseController),
);

//Module

router.get(
  '/courses/:courseId/modules',
  authMiddleware,
  moduleController.list.bind(moduleController),
);
router.post(
  '/courses/:courseId/modules',
  authMiddleware,
  moduleController.create.bind(moduleController),
);
router.put(
  '/courses/:courseId/modules/:id',
  authMiddleware,
  moduleController.update.bind(moduleController),
);
router.delete(
  '/courses/:courseId/modules/:id',
  authMiddleware,
  moduleController.delete.bind(moduleController),
);
router.get(
  '/courses/:courseId/modules/:id',
  authMiddleware,
  moduleController.getById.bind(moduleController),
);

//topic

router.post('/modules/:moduleId/topics', topicController.create.bind(topicController));
router.get('/modules/:moduleId/topics', topicController.getByModule.bind(topicController));
router.get('/topics/:id', topicController.getById.bind(topicController));
router.patch('/topics/:id', topicController.update.bind(topicController));
router.delete('/topics/:id', topicController.delete.bind(topicController));

//note

router.post('/note/upload-urls', getNoteUploadUrls);
router.post('/topic/:topicId/notes', noteController.create.bind(noteController));
router.get('/topic/:topicId/notes', noteController.getByTopic.bind(noteController));
router.get('/notes/:id', noteController.getById.bind(noteController));
router.patch('/notes/:id', noteController.update.bind(noteController));
router.delete('/notes/:id', noteController.delete.bind(noteController));

//assignment

router.post('/:topicId/assgn', assController.createAssignment.bind(assController));
router.get('/:topicId/assgn', assController.getAssignmentsByTopic.bind(assController));
router.get('/assgn/:id', assController.getAssignmentById.bind(assController));
router.patch('/assgn/:id', assController.updateAssignment.bind(assController));
router.delete('/assgn/:id', assController.deleteAssignment.bind(assController));

//video

router.get('/videos/upload-url', authMiddleware, videoCtrl.getVideoUploadUrl.bind(videoCtrl));
router.post('/videos', authMiddleware, videoCtrl.createVideo.bind(videoCtrl));
router.get('/videos/topic/:topicId', authMiddleware, videoCtrl.listByTopic.bind(videoCtrl));
router.patch('/videos/:id', authMiddleware, videoCtrl.update.bind(videoCtrl));
router.delete('/videos/:id', authMiddleware, videoCtrl.remove.bind(videoCtrl));

//dashboard

router.get('/dashboard/kpis', authMiddleware, enrollmentController.getKpis);
router.get('/dashboard/revenue', authMiddleware, enrollmentController.getRevenueTrend);
router.get('/dashboard/enrollments', authMiddleware, enrollmentController.getEnrollmentTrend);
router.get('/dashboard/top-courses', authMiddleware, enrollmentController.getTopCourses);
router.get(
  '/dashboard/recent-enrollments',
  authMiddleware,
  enrollmentController.getRecentEnrollments,
);
router.get('/dashboard/my-courses', authMiddleware, enrollmentController.getMyCoursesOverview);
router.get(
  '/dashboard/pending-approvals',
  authMiddleware,
  enrollmentController.getPendingApprovalsPreview,
);

export default router;
