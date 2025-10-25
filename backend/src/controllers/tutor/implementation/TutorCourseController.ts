import { NextFunction, Request, Response } from 'express';
import { ITutorCourseService } from '../../../services/tutor/ITutorCourseService';
import { AuthenticatedRequest } from '../../../types/Index';
import { ICourse } from '../../../models/course/CourseSchema';
import { presignPutObject } from '../../../utils/s3Presign';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export class TutorCourseController {
  constructor(private courseService: ITutorCourseService) {}

  async getUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'courses', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getDemoUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'videos', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async createCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tutorId = req.user!.id;

      const imageKey = req.body.imageKey as string | undefined;
      const demoKey = req.body.demoKey as string | undefined;
      const data = {
        ...req.body,
        tutor: tutorId,
        thumbnailKey: imageKey,
        demoKey: demoKey,
      };
      console.log(data);
      const course = await this.courseService.createCourse(data);
      console.log(course);

      res.status(HttpStatus.CREATED).json(course);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async getAllCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tutorId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const result = await this.courseService.getAllCourses(tutorId, page, limit, search);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      if (!course) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Course not found' });
        return;
      }
      res.status(HttpStatus.OK).json(course);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const thumbnailKey = (req.body.thumbnailKey ?? req.body.imageKey) as string | undefined;
      const demoKey = req.body.demoKey as string | undefined;

      const data: Partial<ICourse> = {
        ...req.body, 
        ...(thumbnailKey && { thumbnailKey }),
        ...(demoKey && { demoKey }),
      };

      const updated = await this.courseService.updateCourse(id, data);

      if (!updated) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Course not found' });
        return;
      }

      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      console.error('updateCourse error:', err);
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async reapplyCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.id;
      const tutorId = req.user!.id;
      const updated = await this.courseService.reapply(courseId, tutorId);
      res.status(HttpStatus.OK).json(updated);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
  async softDeleteCourse(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await this.courseService.softDeleteCourse(id);
    res.status(HttpStatus.NO_CONTENT).end();
  }
}
