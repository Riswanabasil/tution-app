
import { ModuleRepository } from "../../../repositories/module/implementation/ModuleRepository";
import { TopicRepository } from "../../../repositories/topic/implementation/TopicRepository";

export class PaidCourseService {
 

  constructor(
     private moduleRepository: ModuleRepository,
  private topicRepository: TopicRepository
  ) {
   
  }

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

}
