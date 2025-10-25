"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TutorRepository_1 = require("../repositories/tutor/implementation/TutorRepository");
const BcryptHasher_1 = require("../services/common/BcryptHasher");
const TutorService_1 = require("../services/tutor/implementation/TutorService");
const TutorControllers_1 = require("../controllers/tutor/implementation/TutorControllers");
const TokenService_1 = require("../services/common/TokenService");
const CourseRepository_1 = require("../repositories/course/implementation/CourseRepository");
const TutorCourseService_1 = require("../services/tutor/implementation/TutorCourseService");
const TutorCourseController_1 = require("../controllers/tutor/implementation/TutorCourseController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ModuleRepository_1 = require("../repositories/module/implementation/ModuleRepository");
const ModuleService_1 = require("../services/tutor/implementation/ModuleService");
const ModuleController_1 = require("../controllers/tutor/implementation/ModuleController");
//topic
const TopicRepository_1 = require("../repositories/topic/implementation/TopicRepository");
const TopicService_1 = require("../services/tutor/implementation/TopicService");
const TopicController_1 = require("../controllers/tutor/implementation/TopicController");
//note
const NoteRepository_1 = require("../repositories/note/implementation/NoteRepository");
const NoteService_1 = require("../services/tutor/implementation/NoteService");
const NoteController_1 = require("../controllers/tutor/implementation/NoteController");
//assignment
const AssignmentRepository_1 = require("../repositories/assignment/implementation/AssignmentRepository");
const AssignmentService_1 = require("../services/tutor/implementation/AssignmentService");
const AssignmentController_1 = require("../controllers/tutor/implementation/AssignmentController");
const VideoRepository_1 = require("../repositories/video/implementation/VideoRepository");
const VideoService_1 = require("../services/tutor/implementation/VideoService");
const VideoController_1 = require("../controllers/tutor/implementation/VideoController");
const EnrollmentRepository_1 = require("../repositories/payment/implementation/EnrollmentRepository");
const DashboardService_1 = require("../services/tutor/implementation/DashboardService");
const DashboardController_1 = require("../controllers/tutor/implementation/DashboardController");
const upload_controller_1 = require("../controllers/tutor/implementation/upload.controller");
const LiveSessionRepository_1 = require("../repositories/liveSession/implementation/LiveSessionRepository");
const LiveSessionService_1 = require("../services/tutor/implementation/LiveSessionService");
const liveSession_controller_1 = require("../controllers/tutor/implementation/liveSession.controller");
const router = express_1.default.Router();
const tutorRepo = new TutorRepository_1.TutorRepository();
const hasher = new BcryptHasher_1.BcryptHasher();
const tokenService = new TokenService_1.TokenService();
const tutorService = new TutorService_1.TutorService(tutorRepo, hasher, tokenService);
const tutorController = new TutorControllers_1.TutorController(tutorService);
const courseRepo = new CourseRepository_1.CourseRepository();
const courseService = new TutorCourseService_1.TutorCourseService(courseRepo);
const courseController = new TutorCourseController_1.TutorCourseController(courseService);
const moduleRepo = new ModuleRepository_1.ModuleRepository();
const moduleService = new ModuleService_1.TutorModuleService(moduleRepo);
const moduleController = new ModuleController_1.ModuleController(moduleService);
//topic
const topicRepo = new TopicRepository_1.TopicRepository();
const topicService = new TopicService_1.TopicService(topicRepo);
const topicController = new TopicController_1.TopicController(topicService);
//note
const noteRepo = new NoteRepository_1.NoteRepository();
const noteService = new NoteService_1.NoteService(noteRepo);
const noteController = new NoteController_1.NoteController(noteService);
//assignment
const assRepo = new AssignmentRepository_1.AssignmentRepository();
const assService = new AssignmentService_1.AssignmentService(assRepo, topicRepo, moduleRepo, courseRepo);
const assController = new AssignmentController_1.AssignmentController(assService);
//video
const videoRepo = new VideoRepository_1.VideoRepository();
const videoService = new VideoService_1.VideoService(videoRepo);
const videoCtrl = new VideoController_1.VideoController(videoService);
//dashboard
const enrollmentRepo = new EnrollmentRepository_1.EnrollmentRepository();
const enrollmentService = new DashboardService_1.TutorDashboardService(courseRepo, enrollmentRepo, tutorRepo);
const enrollmentController = new DashboardController_1.TutorDashboardController(enrollmentService);
//live session
const liveRepo = new LiveSessionRepository_1.LiveSessionRepository();
const liveService = new LiveSessionService_1.LiveSessionService(liveRepo, topicRepo, moduleRepo, courseRepo);
const liveController = new liveSession_controller_1.LiveSessionController(liveService);
router.post('/register', tutorController.registerTutor.bind(tutorController));
router.post('/verification/upload-urls', tutorController.getVerificationUploadUrls.bind(tutorController));
router.post('/submit-verification', tutorController.submitTutorVerification.bind(tutorController));
router.post('/login', tutorController.loginTutor.bind(tutorController));
router.post('/logout', tutorController.logoutTutor.bind(tutorController));
router.post('/google-login', tutorController.googleLoginTutor.bind(tutorController));
router.get('/refresh-token', tutorController.refreshAccessToken.bind(tutorController));
//profile
router.get('/profile', authMiddleware_1.authMiddleware, tutorController.getProfile.bind(tutorController));
router.put('/profile', authMiddleware_1.authMiddleware, tutorController.updateProfile.bind(tutorController));
router.put('/profile/password', authMiddleware_1.authMiddleware, tutorController.changePassword.bind(tutorController));
router.get('/profile/stats', authMiddleware_1.authMiddleware, tutorController.getStats.bind(tutorController));
router.get('/profile/courses', authMiddleware_1.authMiddleware, tutorController.getMyCourses.bind(tutorController));
router.get('/profile/upload-url', tutorController.getProfileUploadUrl);
//course
router.post('/course', authMiddleware_1.authMiddleware, courseController.createCourse.bind(courseController));
router.get('/courses', authMiddleware_1.authMiddleware, courseController.getAllCourses.bind(courseController));
router.get('/course/:id', courseController.getCourseById.bind(courseController));
router.put('/course/:id', courseController.updateCourse.bind(courseController));
router.delete('/course/:id', courseController.softDeleteCourse.bind(courseController));
router.get('/courses/upload-url', courseController.getUploadUrl);
router.get('/courses/demo-upload-url', courseController.getDemoUploadUrl);
router.patch('/courses/:id/reapply', authMiddleware_1.authMiddleware, courseController.reapplyCourse.bind(courseController));
//Module
router.get('/courses/:courseId/modules', authMiddleware_1.authMiddleware, moduleController.list.bind(moduleController));
router.post('/courses/:courseId/modules', authMiddleware_1.authMiddleware, moduleController.create.bind(moduleController));
router.put('/courses/:courseId/modules/:id', authMiddleware_1.authMiddleware, moduleController.update.bind(moduleController));
router.delete('/courses/:courseId/modules/:id', authMiddleware_1.authMiddleware, moduleController.delete.bind(moduleController));
router.get('/courses/:courseId/modules/:id', authMiddleware_1.authMiddleware, moduleController.getById.bind(moduleController));
//topic
router.post('/modules/:moduleId/topics', topicController.create.bind(topicController));
router.get('/modules/:moduleId/topics', topicController.getByModule.bind(topicController));
router.get('/topics/:id', topicController.getById.bind(topicController));
router.patch('/topics/:id', topicController.update.bind(topicController));
router.delete('/topics/:id', topicController.delete.bind(topicController));
//note
router.post('/note/upload-urls', upload_controller_1.getNoteUploadUrls);
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
router.get('/videos/upload-url', authMiddleware_1.authMiddleware, videoCtrl.getVideoUploadUrl.bind(videoCtrl));
router.post('/videos', authMiddleware_1.authMiddleware, videoCtrl.createVideo.bind(videoCtrl));
router.get('/videos/topic/:topicId', authMiddleware_1.authMiddleware, videoCtrl.listByTopic.bind(videoCtrl));
router.patch('/videos/:id', authMiddleware_1.authMiddleware, videoCtrl.update.bind(videoCtrl));
router.delete('/videos/:id', authMiddleware_1.authMiddleware, videoCtrl.remove.bind(videoCtrl));
//dashboard
router.get('/dashboard/kpis', authMiddleware_1.authMiddleware, enrollmentController.getKpis);
router.get('/dashboard/revenue', authMiddleware_1.authMiddleware, enrollmentController.getRevenueTrend);
router.get('/dashboard/enrollments', authMiddleware_1.authMiddleware, enrollmentController.getEnrollmentTrend);
router.get('/dashboard/top-courses', authMiddleware_1.authMiddleware, enrollmentController.getTopCourses);
router.get('/dashboard/recent-enrollments', authMiddleware_1.authMiddleware, enrollmentController.getRecentEnrollments);
router.get('/dashboard/my-courses', authMiddleware_1.authMiddleware, enrollmentController.getMyCoursesOverview);
router.get('/dashboard/pending-approvals', authMiddleware_1.authMiddleware, enrollmentController.getPendingApprovalsPreview);
// live session
router.post('/:topicId/livesession', authMiddleware_1.authMiddleware, liveController.create.bind(liveController));
router.get('/:topicId/livesession', authMiddleware_1.authMiddleware, liveController.listByTopic.bind(liveController));
router.get('/livesession/:id', authMiddleware_1.authMiddleware, liveController.getById.bind(liveController));
router.patch('/livesession/:id/status', authMiddleware_1.authMiddleware, liveController.updateStatus.bind(liveController));
router.delete('/livesession/:id', authMiddleware_1.authMiddleware, liveController.delete.bind(liveController));
exports.default = router;
