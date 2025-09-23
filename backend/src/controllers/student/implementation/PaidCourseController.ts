import { Request, Response } from 'express';
import { PaidCourseService } from '../../../services/student/implementation/PaidCourseService';
import { HttpStatus } from '../../../constants/statusCode';
import { IPaidCourseService } from '../../../services/student/IPaidCourseService';

export class PaidCourseController {
  constructor(private paidCourseService: IPaidCourseService) {}

  getModulesByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const modules = await this.paidCourseService.getModulesByCourseId(courseId);
      res.status(HttpStatus.OK).json(modules);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to fetch modules', error });
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
        parseInt(limit as string),
      );

      res.json(result);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch topics', err });
    }
  }

  // async getNotes(req: Request, res: Response) {
  //   try {
  //     const { topicId } = req.params;
  //     const notes = await this.paidCourseService.getNotesByTopic(topicId);
  //     res.json(notes);
  //   } catch (err) {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch notes' });
  //   }
  // }

  async getNotes(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const notes = await this.paidCourseService.getNotesByTopic(topicId);
      res.json(notes);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch notes' });
    }
  }
}
