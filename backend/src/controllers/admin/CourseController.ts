import { Request, Response } from 'express';
import { courseService } from '../../services/admin/CourseService';

export const courseController = {
  createCourse: async (req: Request, res: Response) => {
    try {
       const thumbnail = req.file?.filename; 
    const data = {
      ...req.body,
      thumbnail,
    };
      const course = await courseService.createCourse(data);
      res.status(201).json({ success: true, course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create course', error });
    }
  },

  getCourses: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const data = await courseService.getAllCourses(page, limit, search);
      res.status(200).json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch courses', error });
    }
  },

  getCourseById: async (req: Request, res: Response) => {
    try {
      const course = await courseService.getCourseById(req.params.id);
      res.status(200).json({ success: true, course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Course not found', error });
    }
  },

  updateCourse: async (req: Request, res: Response) => {
    try {

       const thumbnail = req.file?.filename;

    const data = {
      ...req.body,
      ...(thumbnail && { thumbnail })
    };
      const updated = await courseService.updateCourse(req.params.id, data);
      res.status(200).json({ success: true, updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update course', error });
    }
  },

  deleteCourse: async (req: Request, res: Response) => {
    try {
      await courseService.deleteCourse(req.params.id);
      res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete course', error });
    }
  }

}