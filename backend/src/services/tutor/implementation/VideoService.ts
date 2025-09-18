import type { IVideo } from '../../../models/video/VideoSchema';
import type { IVideoRepository } from '../../../repositories/video/IVideoRepository';
import { presignGetObject } from '../../../utils/s3Presign';
import type { CreateVideoDTO, UpdateVideoDTO, IVideoService } from '../IVideoService';

export class VideoService implements IVideoService {
  constructor(private repo: IVideoRepository) {}

  create(data: CreateVideoDTO): Promise<IVideo> {
    return this.repo.create({
      tutor: data.tutorId,
      topic: data.topicId,
      title: data.title,
      description: data.description,
      durationSec: data.durationSec,
      s3Key: data.key,
      contentType: data.contentType,
    } as any);
  }

  // listByTopic(topicId: string): Promise<IVideo[]> {
  //   return this.repo.listByTopic(topicId);
  // }

  async listByTopic(topicId: string): Promise<any[]> {
  const rows = await this.repo.listByTopic(topicId);
  const plain = rows.map((v: any) => (v.toObject ? v.toObject() : v));

  return Promise.all(
    plain.map(async (v: any) => ({
      ...v,
      url: v.s3Key ? await presignGetObject(v.s3Key) : undefined,
    }))
  );
}

  update(id: string, data: UpdateVideoDTO): Promise<IVideo | null> {
    return this.repo.update(id, data);
  }

  softDelete(id: string): Promise<boolean> {
    return this.repo.softDelete(id);
  }
}
