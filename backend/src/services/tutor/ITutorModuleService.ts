import { IModule } from '../../models/module/ModuleSchema';

export interface ITutorModuleService {
  listByCourse(courseId: string): Promise<IModule[]>;
  createModule(courseId: string, name: string, order: number): Promise<IModule>;
  getById(courseId: string, moduleId: string): Promise<IModule | null>;
  updateModule(id: string, data: Partial<IModule>): Promise<IModule | null>;
  deleteModule(id: string): Promise<void>;
}
