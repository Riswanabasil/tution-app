import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/admin/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getAllTutorsController, getTutorByIdController, updateTutorStatusController } from "../controllers/admin/tutor/AdminTutorController";
import { getAllStudentsController, toggleBlockStudentController } from "../controllers/admin/student/AdminStudentController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = express.Router();

router.post("/login", loginAdmin);
router.get('/students',adminAuthMiddleware, getAllStudentsController);
router.get("/tutors",adminAuthMiddleware, getAllTutorsController);
router.get("/tutor/:id",adminAuthMiddleware, getTutorByIdController)
router.patch('/tutor/:id/status',adminAuthMiddleware,updateTutorStatusController)
router.patch("/student/:id/block",adminAuthMiddleware, toggleBlockStudentController);
router.post("/logout", logoutAdmin)
export default router;
