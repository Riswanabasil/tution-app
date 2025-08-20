import type { IVideo } from "../../models/video/VideoSchema";
import type { IVideoProgress } from "../../models/video/VideoProgress";

export type StudentVideoWithProgress = Pick<IVideo,"_id"|"title"|"description"|"durationSec"|"url"|"createdAt"> & {
  progress: Pick<IVideoProgress,"lastPositionSec"|"totalWatchedSec"|"percent"|"completed">;
};

export interface IStudentVideoService {
  listByTopicForStudent(topicId: string, studentId: string): Promise<StudentVideoWithProgress[]>;
  upsertProgress(input: {
    studentId: string;
    videoId: string;
    ranges: { startSec: number; endSec: number }[];
    lastPositionSec: number;
    durationSecHint?: number;
  }): Promise<IVideoProgress>;
}
