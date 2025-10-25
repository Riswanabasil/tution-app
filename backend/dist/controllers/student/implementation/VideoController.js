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
Object.defineProperty(exports, '__esModule', { value: true });
exports.StudentVideoController = void 0;
class StudentVideoController {
  constructor(svc) {
    this.svc = svc;
  }
  listByTopic(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const topicId = req.params.topicId;
        const studentId = req.user.id;
        const data = yield this.svc.listByTopicForStudent(topicId, studentId);
        res.json(data);
      } catch (e) {
        next(e);
      }
    });
  }
  upsertProgress(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const videoId = req.params.videoId;
        const studentId = req.user.id;
        const { ranges, lastPositionSec, durationSec } = req.body;
        const doc = yield this.svc.upsertProgress({
          studentId,
          videoId,
          ranges,
          lastPositionSec,
          durationSecHint: durationSec,
        });
        res.json({
          videoId,
          lastPositionSec: doc.lastPositionSec,
          totalWatchedSec: doc.totalWatchedSec,
          percent: doc.percent,
          completed: doc.completed,
          updatedAt: doc.updatedAt,
        });
      } catch (e) {
        next(e);
      }
    });
  }
}
exports.StudentVideoController = StudentVideoController;
