import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/admin/AdminController";
import { assignCoursesToTutor, getAllTutorsController, getTutorByIdController, updateTutorStatusController } from "../controllers/admin/tutor/AdminTutorController";
import { getAllStudentsController, toggleBlockStudentController } from "../controllers/admin/student/AdminStudentController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";
import {courseController} from "../controllers/admin/CourseController"
import { uploadCourseThumbnail } from "../middlewares/uploadCourseThumbnail";

const router = express.Router();

// router.post("/login", loginAdmin);
// router.get('/students',adminAuthMiddleware, getAllStudentsController);
router.get("/tutors",adminAuthMiddleware, getAllTutorsController);
router.get("/tutor/:id",adminAuthMiddleware, getTutorByIdController)
router.patch('/tutor/:id/status',adminAuthMiddleware,updateTutorStatusController)
router.patch("/student/:id/block",adminAuthMiddleware, toggleBlockStudentController);
router.post("/logout", logoutAdmin)
router.post("/course",uploadCourseThumbnail,courseController.createCourse)
router.get("/courses",courseController.getCourses)
router.get('/course/:id',courseController.getCourseById)
router.put('/course/:id',uploadCourseThumbnail,courseController.updateCourse)
router.delete('/course/:id', courseController.deleteCourse);
router.post('/:tutorId/assign-courses', assignCoursesToTutor);
export default router;
