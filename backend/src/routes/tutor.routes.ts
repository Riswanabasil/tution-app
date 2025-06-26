import express from 'express';
import { TutorController } from '../controllers/tutor/implementation/TutorController';
import { uploadTutorDocs } from '../middlewares/uploadTutorDocs';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getTutorCoursesController } from '../controllers/tutor/implementation/DashboardController';


const router = express.Router();
const tutorController = new TutorController();

router.post('/register', tutorController.registerTutor);
router.post('/login', tutorController.loginTutor);
router.post('/submit-verification', uploadTutorDocs, tutorController.submitVerificationController);
router.get("/dashboard/courses",authMiddleware, getTutorCoursesController)

export default router;
