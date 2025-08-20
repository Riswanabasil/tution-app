import type { IStudentVideoService, StudentVideoWithProgress } from "../IVideoService";
import type { IVideoProgressRepository } from "../../../repositories/video/IVideoProgressRepository";
import Video from "../../../models/video/VideoSchema";

export class StudentVideoService implements IStudentVideoService {
  constructor(
    private progressRepo: IVideoProgressRepository
  ) {}

  async listByTopicForStudent(topicId: string, studentId: string): Promise<StudentVideoWithProgress[]> {
    const videos = await this.progressRepo.listByTopicPublic(topicId);
    if (videos.length === 0) return [];

    const progresses = await this.progressRepo.findByStudentAndVideoIds(
      studentId,
      videos.map(v => String(v._id))
    );
    const map = new Map(progresses.map(p => [String(p.video), p]));
    return videos.map(v => ({
      ...v,
      progress: map.get(String(v._id)) ? {
        lastPositionSec: map.get(String(v._id))!.lastPositionSec,
        totalWatchedSec: map.get(String(v._id))!.totalWatchedSec,
        percent: map.get(String(v._id))!.percent,
        completed: map.get(String(v._id))!.completed,
      } : { lastPositionSec: 0, totalWatchedSec: 0, percent: 0, completed: false }
    }));
  }

  async upsertProgress(input: {
    studentId: string;
    videoId: string;
    ranges: { startSec: number; endSec: number }[];
    lastPositionSec: number;
    durationSecHint?: number;
  }) {
    // prefer DB duration if present
    const video = await Video.findById(input.videoId).select("durationSec");
    return this.progressRepo.upsertAndMerge({
      studentId: input.studentId,
      videoId: input.videoId,
      addRanges: input.ranges,
      lastPositionSec: input.lastPositionSec,
      durationSecHint: input.durationSecHint,
      durationSecDb: video?.durationSec ?? undefined,
    });
  }
}
