import express from "express";
import { AdminService } from "../services/admin/implementation/AdminService";
import { AdminController } from "../controllers/admin/AdminControllers";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";
import { StudentRepository } from "../repositories/student/implementation/studentRepository";
import { StudentAdminService } from "../services//admin/implementation/StudentAdminService";
import { StudentAdminController } from "../controllers/admin/StudentAdminController";
import { TutorRepository } from "../repositories/tutor/implementation/TutorRepository";
import { TutorAdminService } from "../services/admin/implementation/TutorAdminService";
import { TutorAdminController } from "../controllers/admin/TutorAdminController";
import { TokenService } from "../services/common/TokenService";


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


// route
router.post("/login",adminController.loginAdmin.bind(adminController));
router.post("/logout",adminController.logoutAdmin.bind(adminController));
router.get('/refresh-token', adminController.refreshAccessToken.bind(adminController))

//Student
router.get("/students",adminAuthMiddleware,studentController.getAllStudents.bind(studentController));
router.patch("/student/:id/block",adminAuthMiddleware,studentController.blockStudent.bind(studentController));

//tutor
router.get("/tutors",adminAuthMiddleware,tutorController.getAllTutors.bind(tutorController));
router.get("/tutor/:id",adminAuthMiddleware,tutorController.getTutorById.bind(tutorController));
router.patch("/tutor/:id/status",adminAuthMiddleware,tutorController.updateTutorStatus.bind(tutorController));


export default router;
