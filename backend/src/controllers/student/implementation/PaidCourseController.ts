import { Request, Response } from "express";
import { PaidCourseService } from "../../../services/student/implementation/PaidCourseService";

export class PaidCourseController {


  constructor(
    private paidCourseService:PaidCourseService
  ) {
  
  }

  getModulesByCourse = async (req: Request, res: Response):Promise<void> => {
    try {
      const { courseId } = req.params;
      const modules = await this.paidCourseService.getModulesByCourseId(courseId);
      res.status(200).json(modules);
    } catch (error) {
       res.status(500).json({ message: "Failed to fetch modules", error });
    }
  };

async getTopicsByModule(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const { search = '', page = '1', limit = '5' } = req.query;

    const result = await this.paidCourseService.getTopicsByModuleId(
      moduleId,
      String(search),
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch topics',err  });
  }
}

}
