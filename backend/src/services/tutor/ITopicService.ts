import { ITopic } from '../../models/topic/TopicSchema';

export interface ITopicService {
  create(data: Partial<ITopic>): Promise<ITopic>;
  getByModule(moduleId: string): Promise<ITopic[]>;
  getById(id: string): Promise<ITopic | null>;
  update(id: string, data: Partial<ITopic>): Promise<ITopic | null>;
  delete(id: string): Promise<void>;
}
