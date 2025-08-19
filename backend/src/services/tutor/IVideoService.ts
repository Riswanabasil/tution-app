import type { IVideo } from "../../models/video/VideoSchema";

export type CreateVideoDTO = {
  tutorId: string;
  topicId: string;
  title: string;
  description?: string;
  durationSec: number;
  key: string;
  contentType: string;
  url: string;               
};

export type UpdateVideoDTO = Partial<Pick<IVideo, "title" | "description" | "durationSec">>;

export interface IVideoService {
  create(data: CreateVideoDTO): Promise<IVideo>;
  listByTopic(topicId: string): Promise<IVideo[]>;
  update(id: string, data: UpdateVideoDTO): Promise<IVideo | null>;
  softDelete(id: string): Promise<boolean>;
}
