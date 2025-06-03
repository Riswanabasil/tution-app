import express from "express";
import { getAllStudents, loginAdmin } from "../controllers/admin/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", loginAdmin);
router.get('/students', authMiddleware, getAllStudents);

export default router;
