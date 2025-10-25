import { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/statusCode';
import { IStudentLiveSessionService } from '../../../services/student/ILiveSessionService';

export class StudentLiveSessionController {
  constructor(private service: IStudentLiveSessionService) {}

  listByTopic = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const { status } = req.query as { status?: 'scheduled' | 'live' | 'ended' };
      const sessions = await this.service.listByTopic(topicId, status);
      res.json(sessions);
    } catch (err) {
      console.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch sessions' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const session = await this.service.getById(id);
      if (!session) res.status(HttpStatus.NOT_FOUND).json({ message: 'Session not found' });
      res.json(session);
    } catch (err) {
      console.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch session' });
    }
  };
}
