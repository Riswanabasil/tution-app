import { ITopic } from "../../models/topic/TopicSchema";

export interface ITopicRepository {
  create(data: Partial<ITopic>): Promise<ITopic>;

  findByModule(moduleId: string): Promise<ITopic[]>;

  findWithFilter(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ topics: ITopic[]; total: number }>;

  findById(id: string): Promise<ITopic | null>;

  update(id: string, data: Partial<ITopic>): Promise<ITopic | null>;

  delete(id: string): Promise<void>;
}
