import { IModule } from '../../models/module/ModuleSchema';
import { INote } from '../../models/note/NoteSchema';
import { ITopic } from '../../models/topic/TopicSchema';

export interface IPaidCourseService {
  getModulesByCourseId(courseId: string): Promise<IModule[]>;
  getTopicsByModuleId(
    moduleId: string,
    search: string,
    page?: number,
    limit?: number,
  ): Promise<{ topics: ITopic[]; total: number }>;
  getNotesByTopic(topicId: string): Promise<INote[]>;
}
