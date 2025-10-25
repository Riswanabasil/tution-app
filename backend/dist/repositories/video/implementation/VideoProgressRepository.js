'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.StudentVideoProgressRepository = void 0;
const VideoSchema_1 = __importDefault(require('../../../models/video/VideoSchema'));
const VideoProgress_1 = __importDefault(require('../../../models/video/VideoProgress'));
const BaseRepository_1 = require('../../base/BaseRepository');
const progressUtils_1 = require('../../../utils/progressUtils');
class StudentVideoProgressRepository extends BaseRepository_1.BaseRepository {
  constructor(videoModel = VideoSchema_1.default, progressModel = VideoProgress_1.default) {
    super(progressModel);
    this.videoModel = videoModel;
    this.progressModel = progressModel;
  }
  listByTopicPublic(topicId) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.videoModel
        .find({ topic: topicId, isDeleted: false })
        .select('_id createdAt title description durationSec s3Key')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    });
  }
  findByStudentAndVideo(studentId, videoId) {
    return this.progressModel.findOne({ student: studentId, video: videoId }).exec();
  }
  findByStudentAndVideoIds(studentId, videoIds) {
    return this.progressModel.find({ student: studentId, video: { $in: videoIds } }).exec();
  }
  upsertAndMerge(input) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;
      const duration =
        (_b = (_a = input.durationSecDb) !== null && _a !== void 0 ? _a : input.durationSecHint) !==
          null && _b !== void 0
          ? _b
          : 0;
      const doc = yield this.progressModel.findOne({
        student: input.studentId,
        video: input.videoId,
      });
      if (!doc) {
        const merged = (0, progressUtils_1.mergeRanges)([], input.addRanges, duration);
        const { totalWatchedSec, percent, completed } = (0, progressUtils_1.recomputeProgress)({
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
      doc.lastPositionSec = Math.max(
        (_c = doc.lastPositionSec) !== null && _c !== void 0 ? _c : 0,
        (_d = input.lastPositionSec) !== null && _d !== void 0 ? _d : 0,
      );
      if (input.durationSecHint) doc.durationSecSnapshot = input.durationSecHint;
      doc.ranges = (0, progressUtils_1.mergeRanges)(
        doc.ranges || [],
        input.addRanges || [],
        duration,
      );
      const { totalWatchedSec, percent, completed } = (0, progressUtils_1.recomputeProgress)({
        ranges: doc.ranges,
        lastPositionSec: doc.lastPositionSec,
        durationSec: duration || doc.durationSecSnapshot || 1,
      });
      doc.totalWatchedSec = totalWatchedSec;
      doc.percent = percent;
      doc.completed = completed;
      yield doc.save();
      return doc;
    });
  }
}
exports.StudentVideoProgressRepository = StudentVideoProgressRepository;
