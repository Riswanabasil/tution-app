// import { Request, Response } from "express";
// import { AdminTutorService } from "../../../services/admin/tutor/implementation/AdminTutorService";

// const adminTutorService = new AdminTutorService();

// export const getAllTutorsController = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = req.query.status as string | undefined;
//     const search = req.query.search as string | undefined;

//     const result = await adminTutorService.getAllTutors(page, limit, status, search);

//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Get tutors error:", error.message);
//     res.status(500).json({ message: "Failed to fetch tutors" });
//   }
// };

// export const getTutorByIdController = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const tutor = await adminTutorService.getTutorById(id);
//     res.status(200).json(tutor);
//   } catch (err: any) {
//     console.error(err.message);
//     res.status(404).json({ message: "Tutor not found" });
//   }
// };

// export const updateTutorStatusController=async (req:Request,res:Response)=>{
//   try{
//     const id=req.params.id
//     const status=req.body.status
//     await adminTutorService.updateTutorStatus(id,status)
//     res.status(200).json({ message: "Status updated successfully" });
//   }catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// }


// export const assignCoursesToTutor = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {tutorId}=req.params
//     const { courseIds } = req.body;

//     if (!tutorId || !Array.isArray(courseIds)) {
      
//       res.status(400).json({ success: false, message: 'Invalid data provided' });
//       return 
//     }

//     const updatedTutor = await adminTutorService.assignCourses(tutorId, courseIds);

//     if (!updatedTutor) {
//        res.status(404).json({ success: false, message: 'Tutor not found' });
//        return 
//     }

//     res.status(200).json({ success: true, tutor: updatedTutor });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to assign courses', error });
//   }
// };

