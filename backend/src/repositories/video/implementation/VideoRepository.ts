import { Types } from 'mongoose';
import Video, { IVideo } from '../../../models/video/VideoSchema';
import { BaseRepository } from '../../base/BaseRepository';
import type { IVideoRepository } from '../IVideoRepository';

export class VideoRepository extends BaseRepository<IVideo> implements IVideoRepository {
  constructor() {
    super(Video);
  }

  // async listByTopic(topicId: string): Promise<IVideo[]> {
  //   return Video.find({ topic: new Types.ObjectId(topicId), isDeleted: false }).sort({
  //     createdAt: -1,
  //   });
  // }
  async listByTopic(topicId: string): Promise<IVideo[]> {
    return Video.find({ topic: new Types.ObjectId(topicId), isDeleted: false })
      .sort({ createdAt: -1 })
      .select('_id tutor topic title description durationSec s3Key contentType createdAt updatedAt')
      .lean()
      .exec();
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await Video.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return !!res;
  }
}
