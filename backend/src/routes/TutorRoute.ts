import express from "express";
import { TutorRepository } from "../repositories/tutor/implementation/TutorRepository";
import { BcryptHasher } from "../services/common/BcryptHasher";
import { TutorService } from "../services/tutor/implementation/TutorService";
import { TutorController } from "../controllers/tutor/implementation/TutorControllers";
import { uploadTutorDocs } from "../middlewares/uploadTutorDocs";
import { TokenService } from "../services/common/TokenService";
import { CourseRepository } from "../repositories/course/implementation/CourseRepository";
import { TutorCourseService } from "../services/tutor/implementation/TutorCourseService";
import { TutorCourseController } from "../controllers/tutor/implementation/TutorCourseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getDemoUploadUrl, getProfileUploadUrl, getUploadUrl } from "../controllers/tutor/implementation/upload.controller";
import { ModuleRepository } from '../repositories/module/implementation/ModuleRepository';
import { TutorModuleService } from '../services/tutor/implementation/ModuleService';
import { ModuleController } from '../controllers/tutor/implementation/ModuleController';

const router = express.Router();


const tutorRepo = new TutorRepository();
const hasher = new BcryptHasher();
const tokenService = new TokenService();
const tutorService = new TutorService(tutorRepo, hasher,tokenService);
const tutorController = new TutorController(tutorService);
const courseRepo = new CourseRepository();
const courseService = new TutorCourseService(courseRepo);
const courseController = new TutorCourseController(courseService);
const moduleRepo       = new ModuleRepository();
const moduleService    = new TutorModuleService(moduleRepo);
const moduleController = new ModuleController(moduleService);



router.post("/register", tutorController.registerTutor.bind(tutorController));
router.post("/submit-verification",uploadTutorDocs,tutorController.submitTutorVerification.bind(tutorController));
router.post("/login",tutorController.loginTutor.bind(tutorController));
router.get('/refresh-token', tutorController.refreshAccessToken.bind(tutorController))

//profile

router.get(  "/profile", authMiddleware,tutorController.getProfile.bind(tutorController));
router.put(  "/profile", authMiddleware,tutorController.updateProfile.bind(tutorController));
router.put(  "/profile/password", authMiddleware,tutorController.changePassword.bind(tutorController));
router.get(  "/profile/stats", authMiddleware,tutorController.getStats.bind(tutorController));
router.get(  "/profile/courses",authMiddleware,tutorController.getMyCourses.bind(tutorController));
router.get("/profile/upload-url",getProfileUploadUrl )

//course

router.post("/course" ,authMiddleware,courseController.createCourse.bind(courseController))
router.get("/courses",authMiddleware,courseController.getAllCourses.bind(courseController));
router.get('/course/:id',courseController.getCourseById.bind(courseController));
router.put('/course/:id',courseController.updateCourse.bind(courseController));
router.delete('/course/:id',courseController.softDeleteCourse.bind(courseController));
router.get("/courses/upload-url", getUploadUrl)
router.get("/courses/demo-upload-url", getDemoUploadUrl)
router.patch("/courses/:id/reapply",authMiddleware, courseController.reapplyCourse.bind(courseController));

//Module

router.get('/courses/:courseId/modules',authMiddleware, moduleController.list.bind(moduleController));
router.post('/courses/:courseId/modules', authMiddleware, moduleController.create.bind(moduleController));
router.put('/courses/:courseId/modules/:id', authMiddleware, moduleController.update.bind(moduleController))
router.delete('/courses/:courseId/modules/:id', authMiddleware, moduleController.delete.bind(moduleController));
router.get('/courses/:courseId/modules/:id', authMiddleware, moduleController.getById.bind(moduleController));


export default router;