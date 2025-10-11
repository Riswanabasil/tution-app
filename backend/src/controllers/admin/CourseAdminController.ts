import { Request, Response, NextFunction } from 'express';
import { CourseStatus, ICourse } from '../../models/course/CourseSchema';
import { PaginatedCourses } from '../../types/course';
import { IAdminCourseService } from '../../services/admin/ICourseService';

export class AdminCourseController {
  constructor(private service: IAdminCourseService) {}

  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const status = (req.query.status as CourseStatus) || undefined;
      const search = (req.query.search as string) || undefined;

      const result: PaginatedCourses = await this.service.listPaginated(
        page,
        limit,
        status,
        search,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const { status } = req.body as { status: ICourse['status'] };
      const updated = await this.service.updateStatus(courseId, status);
      res.json({ updated });
    } catch (err) {
      next(err);
    }
  };
}
