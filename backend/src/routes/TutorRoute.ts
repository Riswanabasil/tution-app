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
import { getUploadUrl } from "../controllers/tutor/implementation/upload.controller";

const router = express.Router();


const tutorRepo = new TutorRepository();
const hasher = new BcryptHasher();
const tokenService = new TokenService();
const tutorService = new TutorService(tutorRepo, hasher,tokenService);
const tutorController = new TutorController(tutorService);
const courseRepo = new CourseRepository();
const courseService = new TutorCourseService(courseRepo);
const courseController = new TutorCourseController(courseService);


router.post("/register", tutorController.registerTutor.bind(tutorController));
router.post("/submit-verification",uploadTutorDocs,tutorController.submitTutorVerification.bind(tutorController));
router.post("/login",tutorController.loginTutor.bind(tutorController));
router.get('/refresh-token', tutorController.refreshAccessToken.bind(tutorController))

//course

router.post("/course" ,authMiddleware,courseController.createCourse.bind(courseController))
router.get("/courses",authMiddleware,courseController.getAllCourses.bind(courseController));
router.get('/course/:id',courseController.getCourseById.bind(courseController));
router.put('/course/:id',courseController.updateCourse.bind(courseController));
router.delete('/course/:id',courseController.softDeleteCourse.bind(courseController));
router.get("/courses/upload-url", getUploadUrl)

export default router;