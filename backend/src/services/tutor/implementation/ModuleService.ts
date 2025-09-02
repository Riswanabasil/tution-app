import mongoose from 'mongoose';
import type { IModule } from '../../../models/module/ModuleSchema';
import type { IModuleRepository } from '../../../repositories/module/IModuleRepository';
import { ITutorModuleService } from '../ITutorModuleService';

export class TutorModuleService implements ITutorModuleService {
  constructor(private moduleRepo: IModuleRepository) {}

  async listByCourse(courseId: string): Promise<IModule[]> {
    return this.moduleRepo.findByCourse(courseId);
  }

  async createModule(courseId: string, name: string, order: number): Promise<IModule> {
    return this.moduleRepo.create({
      courseId: new mongoose.Types.ObjectId(courseId),
      name,
      order,
    });
  }
  async getById(courseId: string, moduleId: string): Promise<IModule | null> {
    return this.moduleRepo.findByModule(courseId, moduleId);
  }
  async updateModule(id: string, data: Partial<IModule>): Promise<IModule | null> {
    return this.moduleRepo.update(id, data);
  }

  async deleteModule(id: string): Promise<void> {
    return this.moduleRepo.softDelete(id);
  }
}
