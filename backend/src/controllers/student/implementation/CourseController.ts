import { Request, Response } from 'express';
import { StudentCourseService } from '../../../services/student/implementation/CourseService';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { ICourseService } from '../../../services/student/ICourseService';

export class StudentCourseController {
  constructor(private courseService: ICourseService) {}
  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const search = (req.query.search as string) || '';
      const semester = req.query.semester ? parseInt(req.query.semester as string) : undefined;
      const sortBy = (req.query.sortBy as string) || '';

      const result = await this.courseService.listApproved(page, limit, search, semester, sortBy);
      res.json(result);
    } catch (err) {
      console.error('Student course list error:', err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
  async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const details = await this.courseService.fetchCourseWithModules(courseId);

      res.json(details);
    } catch (err) {
      console.error(err);
      res.status(HttpStatus.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
    }
  }
}
