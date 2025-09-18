import type { IVideo } from '../../models/video/VideoSchema';
import type { IVideoProgress } from '../../models/video/VideoProgress';
import { IBaseRepository } from '../base/IBaseRepository';
export type UpsertProgressInput = {
  studentId: string;
  videoId: string;
  addRanges: { startSec: number; endSec: number }[]; 
  lastPositionSec: number;
  durationSecHint?: number; 
  durationSecDb?: number; 
};


export interface IVideoProgressRepository extends IBaseRepository<IVideoProgress> {
  
  listByTopicPublic(
    topicId: string,
  ): Promise<
    Array<Pick<IVideo, '_id' | 'createdAt' | 'title' | 'description' | 'durationSec' | 'url'>>
  >;

  // ---- Progress side ----
  findByStudentAndVideo(studentId: string, videoId: string): Promise<IVideoProgress | null>;

  findByStudentAndVideoIds(studentId: string, videoIds: string[]): Promise<IVideoProgress[]>;

  upsertAndMerge(input: UpsertProgressInput): Promise<IVideoProgress>;
}
