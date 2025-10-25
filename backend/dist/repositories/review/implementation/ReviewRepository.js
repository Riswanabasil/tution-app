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
exports.ReviewRepository = void 0;
const mongoose_1 = require('mongoose');
const review_1 = __importDefault(require('../../../models/review/review'));
const review_2 = require('../../../utils/review');
class ReviewRepository {
  create(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const doc = yield review_1.default.create({
        courseId: payload.courseId,
        studentId: payload.studentId,
        rating: payload.rating,
        comment: (_a = payload.comment) !== null && _a !== void 0 ? _a : '',
      });
      return (0, review_2.toDTO)(doc);
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield review_1.default.findOne({ _id: id, isDeleted: false });
      return doc ? (0, review_2.toDTO)(doc) : null;
    });
  }
  listByCoursePaginated(courseId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const p = Math.max(1, Number(page) || 1);
      const l = Math.max(1, Number(limit) || 10);
      const skip = (p - 1) * l;
      const [docs, total] = yield Promise.all([
        review_1.default
          .find({ courseId, isDeleted: false })
          .populate({ path: 'studentId', select: 'name profilePic' })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(l)
          .lean(),
        review_1.default.countDocuments({ courseId, isDeleted: false }),
      ]);
      const items = docs.map(review_2.toDTO);
      return {
        items,
        total,
        page: p,
        limit: l,
        hasMore: skip + items.length < total,
      };
    });
  }
  update(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
      const $set = {};
      if (typeof updates.rating !== 'undefined') $set.rating = updates.rating;
      if (typeof updates.comment !== 'undefined') $set.comment = updates.comment;
      const doc = yield review_1.default.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set },
        { new: true },
      );
      return doc ? (0, review_2.toDTO)(doc) : null;
    });
  }
  softDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield review_1.default.updateOne(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
      );
      return res.modifiedCount > 0;
    });
  }
  statsByCourse(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
      const [row] = yield review_1.default.aggregate([
        {
          $match: {
            courseId: new mongoose_1.Types.ObjectId(courseId),
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$courseId',
            count: { $sum: 1 },
            avg: { $avg: '$rating' },
          },
        },
        { $project: { _id: 0, count: 1, avg: { $round: ['$avg', 1] } } },
      ]);
      return row || { count: 0, avg: 0 };
    });
  }
  findByCourseAndStudent(courseId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield review_1.default.findOne({
        courseId,
        studentId,
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
      });
      return doc ? (0, review_2.toDTO)(doc) : null;
    });
  }
}
exports.ReviewRepository = ReviewRepository;
