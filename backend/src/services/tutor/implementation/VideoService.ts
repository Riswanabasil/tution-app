import type { IVideo } from "../../../models/video/VideoSchema";
import type { IVideoRepository } from "../../../repositories/video/IVideoRepository";
import type { CreateVideoDTO, UpdateVideoDTO, IVideoService } from "../IVideoService";

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
      url: data.url,
    } as any);
  }

  listByTopic(topicId: string): Promise<IVideo[]> {
    return this.repo.listByTopic(topicId);
  }

  update(id: string, data: UpdateVideoDTO): Promise<IVideo | null> {
    return this.repo.update(id, data);
  }

  softDelete(id: string): Promise<boolean> {
    return this.repo.softDelete(id);
  }
}
