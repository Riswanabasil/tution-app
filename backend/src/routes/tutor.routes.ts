import express from 'express';
import { TutorController } from '../controllers/tutor/implementation/TutorController';
import { uploadTutorDocs } from '../middlewares/uploadTutorDocs';


const router = express.Router();
const tutorController = new TutorController();

router.post('/register', tutorController.registerTutor);
router.post('/login', tutorController.loginTutor);
router.post('/submit-verification', uploadTutorDocs, tutorController.submitVerificationController);


export default router;
