import { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/statusCode';
import { ILiveSessionService } from '../../../services/tutor/ILiveSessionService';
import { AuthenticatedRequest } from '../../../types/Index';

export class LiveSessionController {
  constructor(private service: ILiveSessionService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { topicId } = req.params;
      const tutorId = req.user!.id;
      const session = await this.service.createSession(topicId, tutorId, req.body);
      res.status(HttpStatus.CREATED).json(session);
    } catch (err) {
      console.error(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to create live session' });
    }
  };

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
    const session = await this.service.getById(req.params.id);
    if (!session) res.status(404).json({ message: 'Session not found' });
    res.json(session);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const updated = await this.service.updateStatus(req.params.id, req.body.status);
    if (!updated) res.status(404).json({ message: 'Session not found' });
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.sendStatus(204);
  };
}
