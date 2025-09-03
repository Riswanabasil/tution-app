import type { Request, Response } from 'express';
import type {
  IAdminDashboardService,
} from '../../services/admin/IAdminDashboardService';

import { parseDateRange, parseGranularity, parseLimit } from '../../utils/dashboard';
import { HttpStatus } from '../../constants/statusCode';
export default class AdminDashboardController {
  constructor(private readonly svc: IAdminDashboardService) {}

  getKpis = async (req: Request, res: Response) => {
    try {
      const range = req.query.from || req.query.to ? parseDateRange(req.query) : undefined;
      const data = await this.svc.getKpis(range);
      res.json(data);
    } catch (err: any) {
      console.error('getKpis error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch KPIs' });
    }
  };

  getRevenueTrend = async (req: Request, res: Response) => {
    try {
      const range = parseDateRange(req.query);
      const granularity = parseGranularity(req.query.granularity, 'daily');
      const data = await this.svc.getRevenueTrend(range, granularity);
      res.json({ granularity, points: data });
    } catch (err: any) {
      console.error('getRevenueTrend error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch revenue trend' });
    }
  };

  getEnrollmentTrend = async (req: Request, res: Response) => {
    try {
      const range = parseDateRange(req.query);
      const granularity = parseGranularity(req.query.granularity, 'monthly');
      const data = await this.svc.getEnrollmentTrend(range, granularity);
      res.json({ granularity, points: data });
    } catch (err: any) {
      console.error('getEnrollmentTrend error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch enrollment trend' });
    }
  };

  getTopCourses = async (req: Request, res: Response) => {
    try {
      const range = parseDateRange(req.query);
      const limit = parseLimit(req.query.limit, 5);
      const rows = await this.svc.getTopCourses(range, limit);
      res.json({ limit, rows });
    } catch (err: any) {
      console.error('getTopCourses error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch top courses' });
    }
  };

  getApprovalQueues = async (req: Request, res: Response) => {
    try {
      const limit = parseLimit(req.query.limit, 10);
      const data = await this.svc.getApprovalQueues(limit);
      res.json({ limit, ...data });
    } catch (err: any) {
      console.error('getApprovalQueues error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch approval queues' });
    }
  };
}
