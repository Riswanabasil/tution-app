import { NextFunction, Request, Response } from 'express';
import { ITutorCourseService } from '../../../services/tutor/ITutorCourseService';
import { AuthenticatedRequest } from '../../../types/Index';
import { ICourse } from '../../../models/course/CourseSchema';
import { presignPutObject } from '../../../utils/s3Presign';

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

      const thumbnailUrl = imageKey
        ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
          encodeURIComponent(imageKey)
        : undefined;
      const demoVideoUrl = demoKey
        ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
          encodeURIComponent(demoKey)
        : undefined;
      const data = {
        ...req.body,
        tutor: tutorId,
        thumbnail: thumbnailUrl,
        demoVideoUrl: demoVideoUrl,
      };
      console.log(data);
      const course = await this.courseService.createCourse(data);
      console.log(course);

      res.status(201).json(course);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAllCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tutorId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const result = await this.courseService.getAllCourses(tutorId, page, limit, search);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }
      res.status(200).json(course);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const thumbnail = (req.file as Express.Multer.File)?.filename;
      const data = { ...req.body, ...(thumbnail && { thumbnail }) };
      const updated = await this.courseService.updateCourse(req.params.id, data);
      if (!updated) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async reapplyCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.id;
      const tutorId = req.user!.id;
      const updated = await this.courseService.reapply(courseId, tutorId);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async softDeleteCourse(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await this.courseService.softDeleteCourse(id);
    res.status(204).end();
  }
}
