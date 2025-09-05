import { Request, Response } from 'express';
import { ITutorAdminService } from '../../services/admin/ITutorAdminService';
import { HttpStatus } from '../../constants/statusCode';
import { ERROR_MESSAGES } from '../../constants/errorMessages';

export class TutorAdminController {
  constructor(private service: ITutorAdminService) {}

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.service.getAllTutors(page, limit, status, search);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getTutorById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id);

      const tutor = await this.service.getTutorById(id);
      res.status(HttpStatus.OK).json(tutor);
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Tutor not found' });
    }
  }

  async updateTutorStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { status } = req.body as { status: 'approved' | 'rejected' };

      await this.service.updateTutorStatus(id, status);
      res.status(HttpStatus.OK).json({ message: 'Tutor status updated' });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }
}
