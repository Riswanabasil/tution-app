import { Types } from 'mongoose';
import type { IModule } from '../../models/module/ModuleSchema';

export interface IModuleRepository {
  findByCourse(courseId: string): Promise<IModule[]>;
  create(data: Partial<IModule>): Promise<IModule>;
  update(id: string, data: Partial<IModule>): Promise<IModule | null>;
  softDelete(id: string): Promise<void>;
  findByModule(courseId: string, moduleId: string): Promise<IModule | null>;
  findById(id: string | Types.ObjectId): Promise<IModule | null>;
}
