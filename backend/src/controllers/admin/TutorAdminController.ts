import { Request, Response } from 'express';
import { ITutorAdminService } from '../../services/admin/ITutorAdminService';

export class TutorAdminController {
  constructor(private service: ITutorAdminService) {}

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.service.getAllTutors(page, limit, status, search);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Failed to fetch tutors' });
    }
  }

  async getTutorById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id);

      const tutor = await this.service.getTutorById(id);
      res.status(200).json(tutor);
    } catch (err: any) {
      res.status(404).json({ message: err.message || 'Tutor not found' });
    }
  }

  async updateTutorStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { status } = req.body as { status: 'approved' | 'rejected' };

      await this.service.updateTutorStatus(id, status);
      res.status(200).json({ message: 'Tutor status updated' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
