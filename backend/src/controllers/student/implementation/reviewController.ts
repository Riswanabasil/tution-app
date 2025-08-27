import { Request, Response } from 'express';
import type { IReviewService } from '../../../services/student/IReviewService';
import { AuthenticatedRequest } from '../../../types/Index';

export default class ReviewController {
  constructor(private svc: IReviewService) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { courseId, rating, comment } = req.body;
      const studentId = req.user?.id || req.body.studentId;

      if (!courseId || !studentId || typeof rating === 'undefined') {
        res.status(400).json({ message: 'courseId, studentId and rating are required' });
        return;
      }
      const r = Number(rating);
      if (!(r >= 1 && r <= 5)) {
        res.status(400).json({ message: 'rating must be between 1 and 5' });
        return;
      }

      const created = await this.svc.create({ courseId, studentId, rating: r, comment });
      res.status(201).json(created);
      return;
    } catch (err: any) {
      if (err?.code === 11000) {
        res.status(409).json({ message: 'You have already reviewed this course.' });
        return;
      }
      if (err?.name === 'CastError') {
        res.status(400).json({ message: 'Invalid id provided' });
        return;
      }
      console.error('createReview error:', err);
      res.status(500).json({ message: 'Failed to create review' });
      return;
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const review = await this.svc.getById(req.params.id);
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res.json(review);
      return;
    } catch (err: any) {
      if (err?.name === 'CastError') {
        res.status(400).json({ message: 'Invalid id provided' });
        return;
      }
      console.error('getReviewById error:', err);
      res.status(500).json({ message: 'Failed to fetch review' });
      return;
    }
  };

  listByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.max(1, Number(req.query.limit || 10));
      const data = await this.svc.listByCourse(req.params.courseId, page, limit);
      res.json(data);
    } catch (err: any) {
      if (err?.name === 'CastError') res.status(400).json({ message: 'Invalid course id' });
      console.error('listCourseReviews error:', err);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updates: { rating?: number; comment?: string } = {};
      if (typeof req.body.rating !== 'undefined') {
        const r = Number(req.body.rating);
        if (!(r >= 1 && r <= 5)) {
          res.status(400).json({ message: 'rating must be between 1 and 5' });
        }
        updates.rating = r;
      }
      if (typeof req.body.comment !== 'undefined') updates.comment = req.body.comment;

      if (!Object.keys(updates).length) {
        res.status(400).json({ message: 'Nothing to update' });
      }

      const updated = await this.svc.update(req.params.id, updates);
      if (!updated) res.status(404).json({ message: 'Review not found' });
      res.json(updated);
    } catch (err: any) {
      if (err?.name === 'CastError') res.status(400).json({ message: 'Invalid id provided' });
      console.error('updateReview error:', err);
      res.status(500).json({ message: 'Failed to update review' });
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const ok = await this.svc.remove(req.params.id);
      if (!ok) res.status(404).json({ message: 'Review not found' });
      res.status(204).send();
    } catch (err: any) {
      if (err?.name === 'CastError') res.status(400).json({ message: 'Invalid id provided' });
      console.error('deleteReview error:', err);
      res.status(500).json({ message: 'Failed to delete review' });
    }
  };

  stats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.svc.stats(req.params.courseId);
      res.json(stats);
    } catch (err: any) {
      if (err?.name === 'CastError') res.status(400).json({ message: 'Invalid course id' });
      console.error('getCourseReviewStats error:', err);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  };
}
