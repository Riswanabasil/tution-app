import { ITopic } from '../../../models/topic/TopicSchema';
import { ITopicService } from '../ITopicService';
import { ITopicRepository } from '../../../repositories/topic/ITopicRepository';

export class TopicService implements ITopicService {
  constructor(private readonly topicRepo: ITopicRepository) {}

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
