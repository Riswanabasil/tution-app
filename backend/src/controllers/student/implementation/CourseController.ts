import { Request, Response } from 'express';
import { StudentCourseService } from '../../../services/student/implementation/CourseService';
import { HttpStatus } from '../../../constants/statusCode';

export class StudentCourseController {
  constructor(private courseService: StudentCourseService) {}
  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const search = (req.query.search as string) || '';
      const semester = req.query.semester ? parseInt(req.query.semester as string) : undefined;
      const sortBy = (req.query.sortBy as string) || '';

      const result = await this.courseService.listApproved(page, limit, search, semester, sortBy);
      res.json(result);
    } catch (err: any) {
      console.error('Student course list error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || 'Internal Server Error' });
    }
  }
  async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const details = await this.courseService.fetchCourseWithModules(courseId);
      details.reviews = [
        {
          author: 'Alice',
          rating: 5,
          comment: 'Great intro!',
          when: '2 weeks ago',
        },
        {
          author: 'Bob',
          rating: 4,
          comment: 'Very clear.',
          when: '1 month ago',
        },
        {
          author: 'Charlie',
          rating: 5,
          comment: 'Loved it!',
          when: '3 months ago',
        },
      ];

      res.json(details);
    } catch (err: any) {
      console.error(err);
      res.status(HttpStatus.NOT_FOUND).json({ message: err.message || 'Course not found' });
    }
  }
}
