import express from "express";
import { TutorRepository } from "../repositories/tutor/implementation/TutorRepository";
import { BcryptHasher } from "../services/common/BcryptHasher";
import { TutorService } from "../services/tutor/implementation/TutorService";
import { TutorController } from "../controllers/tutor/implementation/TutorControllers";
import { uploadTutorDocs } from "../middlewares/uploadTutorDocs";

const router = express.Router();


const tutorRepo = new TutorRepository();
const hasher = new BcryptHasher();
const tutorService = new TutorService(tutorRepo, hasher);
const tutorController = new TutorController(tutorService);

router.post("/register", tutorController.registerTutor.bind(tutorController));
router.post("/submit-verification",uploadTutorDocs,tutorController.submitTutorVerification.bind(tutorController));
router.post("/login",tutorController.loginTutor.bind(tutorController));

export default router;