import { ModuleRepository } from '../../../repositories/module/implementation/ModuleRepository';
import { NoteRepository } from '../../../repositories/note/implementation/NoteRepository';
import { TopicRepository } from '../../../repositories/topic/implementation/TopicRepository';
import { IPaidCourseService } from '../IPaidCourseService';

export class PaidCourseService implements IPaidCourseService{
  constructor(
    private moduleRepository: ModuleRepository,
    private topicRepository: TopicRepository,
    private noteRepository: NoteRepository,
  ) {}

  async getModulesByCourseId(courseId: string) {
    return await this.moduleRepository.findByCourse(courseId);
  }

  async getTopicsByModuleId(moduleId: string, search: string, page = 1, limit = 10) {
    const filter: any = {
      moduleId,
      isDeleted: false,
    };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    return this.topicRepository.findWithFilter(filter, page, limit);
  }

  async getNotesByTopic(topicId: string) {
    return await this.noteRepository.findByTopic(topicId);
  }
}
