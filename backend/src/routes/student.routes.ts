// import express from "express";
// import { StudentController } from "../controllers/student/implementation/studentController";
// import { authMiddleware } from "../middlewares/authMiddleware";
// const router= express.Router()
// const studentController= new StudentController()

// router.post('/register',studentController.registerStudent)
// router.post('/verify-otp', authMiddleware, studentController.verifyStudentOtp)
// router.post('/resend-otp', authMiddleware, studentController.resendOtp)
// router.post('/login', studentController.loginStudent);
// router.get('/refresh-token', studentController.refreshAccessToken)
// router.post('/google-login', studentController.googleLoginStudent)
// export default router