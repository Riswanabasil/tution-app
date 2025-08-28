import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../types/Index';
import type { IStudentVideoService } from '../../../services/student/IVideoService';

export class StudentVideoController {
  constructor(private svc: IStudentVideoService) {}
  async listByTopic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const topicId = req.params.topicId;
      const studentId = req.user!.id;
      const data = await this.svc.listByTopicForStudent(topicId, studentId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
  async upsertProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const videoId = req.params.videoId;
      const studentId = req.user!.id;
      const { ranges, lastPositionSec, durationSec } = req.body as {
        ranges: { startSec: number; endSec: number }[];
        lastPositionSec: number;
        durationSec?: number;
      };
      const doc = await this.svc.upsertProgress({
        studentId,
        videoId,
        ranges,
        lastPositionSec,
        durationSecHint: durationSec,
      });
      res.json({
        videoId,
        lastPositionSec: doc.lastPositionSec,
        totalWatchedSec: doc.totalWatchedSec,
        percent: doc.percent,
        completed: doc.completed,
        updatedAt: doc.updatedAt,
      });
    } catch (e) {
      next(e);
    }
  }
}
