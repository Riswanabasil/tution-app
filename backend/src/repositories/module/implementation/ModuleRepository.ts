import { Module, IModule } from '../../../models/module/ModuleSchema';
import type { IModuleRepository } from '../IModuleRepository';

export class ModuleRepository implements IModuleRepository {
  async findByCourse(courseId: string): Promise<IModule[]> {
    return Module.find({
      courseId,
      deletedAt: { $exists: false }
    })
    .sort({ order: 1 })
    .exec();
  }
 async findByModule(
    courseId: string,
    moduleId: string
  ): Promise<IModule | null> {
    return Module
      .findOne({ _id: moduleId, courseId })
      .exec()
  }
  async create(data: Partial<IModule>): Promise<IModule> {
    return Module.create(data);
  }

  async update(id: string, data: Partial<IModule>): Promise<IModule | null> {
    return Module.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await Module.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}
