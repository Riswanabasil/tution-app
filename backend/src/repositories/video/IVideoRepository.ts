import { IBaseRepository } from '../base/IBaseRepository';
import type { IVideo } from '../../models/video/VideoSchema';

export interface IVideoRepository extends IBaseRepository<IVideo> {
  listByTopic(topicId: string): Promise<IVideo[]>;
  softDelete(id: string): Promise<boolean>;
}
