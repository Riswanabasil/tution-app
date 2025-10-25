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
exports.TopicRepository = void 0;
const TopicSchema_1 = require('../../../models/topic/TopicSchema');
class TopicRepository {
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield TopicSchema_1.TopicModel.create(data);
    });
  }
  findByModule(moduleId) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield TopicSchema_1.TopicModel.find({ moduleId, isDeleted: false })
        .sort({ order: 1 })
        .exec();
    });
  }
  findWithFilter(filter, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const total = yield TopicSchema_1.TopicModel.countDocuments(filter);
      const topics = yield TopicSchema_1.TopicModel.find(filter)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return { topics, total };
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield TopicSchema_1.TopicModel.findOne({ _id: id, isDeleted: false }).exec();
    });
  }
  update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield TopicSchema_1.TopicModel.findByIdAndUpdate(id, data, { new: true }).exec();
    });
  }
  delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield TopicSchema_1.TopicModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
    });
  }
}
exports.TopicRepository = TopicRepository;
