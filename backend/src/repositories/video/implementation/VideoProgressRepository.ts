import { Model } from 'mongoose';
import Video, { IVideo } from '../../../models/video/VideoSchema';
import VideoProgress, { IVideoProgress } from '../../../models/video/VideoProgress';
import { BaseRepository } from '../../base/BaseRepository';
import type { IVideoProgressRepository } from '../IVideoProgressRepository';
import type { UpsertProgressInput } from '../IVideoProgressRepository';
import { mergeRanges, recomputeProgress } from '../../../utils/progressUtils';

export class StudentVideoProgressRepository
  extends BaseRepository<IVideoProgress>
  implements IVideoProgressRepository
{
  private videoModel: Model<IVideo>;
  private progressModel: Model<IVideoProgress>;

  constructor(
    videoModel: Model<IVideo> = Video,
    progressModel: Model<IVideoProgress> = VideoProgress,
  ) {
    super(progressModel as unknown as Model<any>);
    this.videoModel = videoModel;
    this.progressModel = progressModel;
  }

  async listByTopicPublic(topicId: string) {
    return await this.videoModel
      .find({ topic: topicId, isDeleted: false })
      .select('_id createdAt title description durationSec s3Key')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  findByStudentAndVideo(studentId: string, videoId: string) {
    return this.progressModel.findOne({ student: studentId, video: videoId }).exec();
  }

  findByStudentAndVideoIds(studentId: string, videoIds: string[]) {
    return this.progressModel.find({ student: studentId, video: { $in: videoIds } }).exec();
  }

  async upsertAndMerge(input: UpsertProgressInput) {
    const duration = input.durationSecDb ?? input.durationSecHint ?? 0;
    const doc = await this.progressModel.findOne({
      student: input.studentId,
      video: input.videoId,
    });

    if (!doc) {
      const merged = mergeRanges([], input.addRanges, duration);
      const { totalWatchedSec, percent, completed } = recomputeProgress({
        ranges: merged,
        lastPositionSec: input.lastPositionSec,
        durationSec: duration || 1,
      });
      return this.progressModel.create({
        student: input.studentId,
        video: input.videoId,
        lastPositionSec: input.lastPositionSec,
        durationSecSnapshot: input.durationSecHint,
        ranges: merged,
        totalWatchedSec,
        percent,
        completed,
      });
    }

    doc.lastPositionSec = Math.max(doc.lastPositionSec ?? 0, input.lastPositionSec ?? 0);
    if (input.durationSecHint) doc.durationSecSnapshot = input.durationSecHint;
    doc.ranges = mergeRanges(doc.ranges || [], input.addRanges || [], duration);

    const { totalWatchedSec, percent, completed } = recomputeProgress({
      ranges: doc.ranges,
      lastPositionSec: doc.lastPositionSec,
      durationSec: duration || doc.durationSecSnapshot || 1,
    });

    doc.totalWatchedSec = totalWatchedSec;
    doc.percent = percent;
    doc.completed = completed;

    await doc.save();
    return doc;
  }
}
