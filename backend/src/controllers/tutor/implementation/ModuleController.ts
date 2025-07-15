import { Request, Response, NextFunction } from 'express';
import type { TutorModuleService } from '../../../services/tutor/implementation/ModuleService';
import { promises } from 'dns';

export class ModuleController {
  constructor(private service: TutorModuleService) {}

  async list(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const modules      = await this.service.listByCourse(courseId);
      res.json(modules);
    } catch (err:any) {
     res.status(400).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const { name, order } = req.body;
      const mod = await this.service.createModule(courseId, name, order);
      res.status(201).json(mod);
    } catch (err:any) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response):Promise<void> {
    try {
      const { id } = req.params;
      const mod = await this.service.updateModule(id, req.body);
      if (!mod) {
        res.status(404).end();
        return
      }
      res.json(mod);
    } catch (err:any) {
    res.status(400).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteModule(id);
      res.status(204).end();
    } catch (err:any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getById(
    req: Request,
    res: Response,
  ):Promise<void> {
    try {
      const { courseId, id} = req.params
      console.log("courseId",courseId);
      console.log("moduleId",id);
      
      
      const mod = await this.service.getById(courseId, id)
      if (!mod) {
         res
          .status(404)
          .json({ message: 'Module not found' })
          return
      }
      res.json(mod)
    } catch (err:any) {
       res.status(400).json({ message: err.message })
    }
  }
}
