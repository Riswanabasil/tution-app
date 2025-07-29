import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../types/Index";
import { StudentAssignmentService } from "../../../services/student/implementation/StudentAssignmentService";

export class AssignmentController{
    constructor(private assgnService:StudentAssignmentService){
    }

      async getAssignmentsForStudent(req:AuthenticatedRequest,res:Response):Promise<void>{
    try {
    const studentId = req.user!.id; 
    console.log("student",studentId)
   
    const topicId = req.params.topicId;
     console.log("topic",topicId);
    

    const data = await this.assgnService.listAssignmentsWithStatus(topicId, studentId);
    console.log(data);
    
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
  }
}