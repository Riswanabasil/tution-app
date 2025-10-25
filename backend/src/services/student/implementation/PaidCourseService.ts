import { IModuleRepository } from '../../../repositories/module/IModuleRepository';
import { INoteRepository } from '../../../repositories/note/INoteRepository';
import { ITopicRepository } from '../../../repositories/topic/ITopicRepository';
import { presignGetObject } from '../../../utils/s3Presign';
import { IPaidCourseService } from '../IPaidCourseService';

export class PaidCourseService implements IPaidCourseService {
  constructor(
    private moduleRepository: IModuleRepository,
    private topicRepository: ITopicRepository,
    private noteRepository: INoteRepository,
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

  // async getNotesByTopic(topicId: string) {
  //   return await this.noteRepository.findByTopic(topicId);
  // }

  async getNotesByTopic(topicId: string) {
    const rows = await this.noteRepository.findByTopic(topicId);
    const enriched = await Promise.all(
      rows.map(async (n: any) => {
        const url = await presignGetObject(n.pdfKey);
        return {
          ...n,
          pdfUrls: url ? [url] : [],
        };
      }),
    );

    return enriched;
  }
}
