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
exports.LiveSessionRepository = void 0;
const liveSessionSchema_1 = require('../../../models/liveSession/liveSessionSchema');
class LiveSessionRepository {
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return liveSessionSchema_1.LiveSessionModel.create(data);
    });
  }
  findByTopic(topicId, opts) {
    return __awaiter(this, void 0, void 0, function* () {
      const query = { topicId, isDeleted: false };
      if (opts === null || opts === void 0 ? void 0 : opts.status) query.status = opts.status;
      return liveSessionSchema_1.LiveSessionModel.find(query).sort({ createdAt: -1 }).exec();
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return liveSessionSchema_1.LiveSessionModel.findOne({ _id: id, isDeleted: false }).exec();
    });
  }
  updateStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
      return liveSessionSchema_1.LiveSessionModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      ).exec();
    });
  }
  softDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield liveSessionSchema_1.LiveSessionModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
    });
  }
}
exports.LiveSessionRepository = LiveSessionRepository;
