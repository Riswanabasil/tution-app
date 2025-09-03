import { Request, Response, NextFunction } from 'express';
import type { TutorModuleService } from '../../../services/tutor/implementation/ModuleService';
import { promises } from 'dns';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export class ModuleController {
  constructor(private service: TutorModuleService) {}

  async list(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const modules = await this.service.listByCourse(courseId);
      res.json(modules);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const { name, order } = req.body;
      const mod = await this.service.createModule(courseId, name, order);
      res.status(HttpStatus.CREATED).json(mod);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mod = await this.service.updateModule(id, req.body);
      if (!mod) {
        res.status(HttpStatus.NOT_FOUND).end();
        return;
      }
      res.json(mod);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteModule(id);
      res.status(HttpStatus.NO_CONTENT).end();
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, id } = req.params;
      console.log('courseId', courseId);
      console.log('moduleId', id);

      const mod = await this.service.getById(courseId, id);
      if (!mod) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Module not found' });
        return;
      }
      res.json(mod);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ message:ERROR_MESSAGES.BAD_REQUEST });
    }
  }
}
