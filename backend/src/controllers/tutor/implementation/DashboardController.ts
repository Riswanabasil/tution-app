

// import { Request, Response } from "express";
// import { getAssignedCourses } from "../../../services/tutor/implementation/Dashboard.service";
// import { AuthenticatedRequest } from "../../../types/Index";

// export const getTutorCoursesController = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const tutorId = req.user?.id;
//     if (!tutorId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const courses = await getAssignedCourses(tutorId);
//     res.status(200).json({ success: true, courses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error });
//   }
// };
