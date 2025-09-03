import type { Request, Response } from 'express';
import type {
  ITutorDashboardService,
} from '../../../services/tutor/IDashboardService';
import { AuthenticatedRequest } from '../../../types/Index';
import { parseDateRange, parseGranularity, parseLimit } from '../../../utils/dashboard';
import { CourseStatus } from '../../../utils/dashboardTutor';
import { HttpStatus } from '../../../constants/statusCode';

export class TutorDashboardController {
  constructor(private readonly svc: ITutorDashboardService) {}

  getKpis = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = req.query.from || req.query.to ? parseDateRange(req.query) : undefined;
      const data = await this.svc.getKpis(tutorId, range);
      res.json(data);
    } catch (err) {
      console.error('tutor.getKpis', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch tutor KPIs' });
    }
  };

  getRevenueTrend = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = parseDateRange(req.query);
      const granularity = parseGranularity(req.query.granularity, 'daily');
      const points = await this.svc.getRevenueTrend(tutorId, range, granularity);
      res.json({ granularity, points });
    } catch (err) {
      console.error('tutor.getRevenueTrend', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch revenue trend' });
    }
  };

  getEnrollmentTrend = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = parseDateRange(req.query);
      const granularity = parseGranularity(req.query.granularity, 'monthly');
      const points = await this.svc.getEnrollmentTrend(tutorId, range, granularity);
      res.json({ granularity, points });
    } catch (err) {
      console.error('tutor.getEnrollmentTrend', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch enrollment trend' });
    }
  };

  getTopCourses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = parseDateRange(req.query);
      const limit = parseLimit(req.query.limit, 5);
      const rows = await this.svc.getTopCourses(tutorId, range, limit);
      res.json({ limit, rows });
    } catch (err) {
      console.error('tutor.getTopCourses', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch top courses' });
    }
  };

  getRecentEnrollments = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = parseDateRange(req.query);
      const limit = parseLimit(req.query.limit, 20);
      const rows = await this.svc.getRecentEnrollments(tutorId, range, limit);
      res.json({ limit, rows });
    } catch (err) {
      console.error('tutor.getRecentEnrollments', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch recent enrollments' });
    }
  };

  getMyCoursesOverview = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const range = parseDateRange(req.query);
      const status = req.query.status as CourseStatus | undefined;
      const limit = parseLimit(req.query.limit, 50);
      const skip = Number(req.query.skip ?? 0) || 0;

      const result = await this.svc.getMyCoursesOverview(tutorId, range, {
        status,
        limit,
        skip,
      });

      res.json(result);
    } catch (err) {
      console.error('tutor.getMyCoursesOverview', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch courses overview' });
    }
  };

  getPendingApprovalsPreview = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user!.id;
      const limit = parseLimit(req.query.limit, 6);
      const rows = await this.svc.getPendingApprovalsPreview(tutorId, limit);
      res.json({ limit, rows });
    } catch (err) {
      console.error('tutor.getPendingApprovalsPreview', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch pending approvals' });
    }
  };
}
