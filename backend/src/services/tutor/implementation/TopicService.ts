import { TopicRepository } from '../../../repositories/topic/implementation/TopicRepository';
import { ITopic } from '../../../models/topic/TopicSchema';
import { ITopicService } from '../ITopicService';

export class TopicService implements ITopicService{
  constructor(private readonly topicRepo: TopicRepository) {}

  create(data: Partial<ITopic>) {
    return this.topicRepo.create(data);
  }

  getByModule(moduleId: string) {
    return this.topicRepo.findByModule(moduleId);
  }

  getById(id: string) {
    return this.topicRepo.findById(id);
  }

  update(id: string, data: Partial<ITopic>) {
    return this.topicRepo.update(id, data);
  }

  delete(id: string) {
    return this.topicRepo.delete(id);
  }
}
