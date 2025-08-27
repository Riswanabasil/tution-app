import { Request, Response } from 'express';
import { IStudentAdminService } from '../../services/admin/IStudentAdminService';

export class StudentAdminController {
  constructor(private studentService: IStudentAdminService) {}
  async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const sort = (req.query.sort as string) || 'createdAt';
      const order = (req.query.order as string) === 'asc' ? 1 : -1;
      const result = await this.studentService.getAllStudents(page, limit, search, sort, order);
      res.status(200).json(result);
    } catch (error: string | any) {
      res.status(500).json({ message: error.message || 'Failed to fetch students' });
    }
  }
  async blockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isBlocked } = req.body as { isBlocked: boolean };
      await this.studentService.blockStudent(id, isBlocked);
      res.status(200).json({ message: `Student has been ${isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update student status' });
    }
  }
}
