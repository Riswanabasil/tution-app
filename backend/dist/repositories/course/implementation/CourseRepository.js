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
exports.CourseRepository = void 0;
const mongoose_1 = require('mongoose');
const CourseSchema_1 = require('../../../models/course/CourseSchema');
class CourseRepository {
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(data);
      const created = yield CourseSchema_1.Course.create(data);
      console.log(created);
      return created;
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.findById(id).exec();
    });
  }
  findMany(filter_1, _a) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* (filter, { skip, limit, sort = { createdAt: -1 } }) {
        return CourseSchema_1.Course.find(filter)
          .select(
            '_id title code semester tutor price offer actualPrice details status createdAt thumbnailKey demoKey',
          )
          .skip(skip)
          .limit(limit)
          .sort(sort)
          .populate('tutor', 'name email')
          .exec();
      },
    );
  }
  countDocuments(filter) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.countDocuments(filter).exec();
    });
  }
  update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.findByIdAndUpdate(id, data, { new: true }).exec();
    });
  }
  softDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield CourseSchema_1.Course.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
    });
  }
  countByStatusMap() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const rows = yield CourseSchema_1.Course.aggregate([
        { $match: { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] } },
        { $group: { _id: '$status', n: { $sum: 1 } } },
      ]).exec();
      return {
        pending:
          (_b =
            (_a = rows.find((r) => r._id === 'pending')) === null || _a === void 0
              ? void 0
              : _a.n) !== null && _b !== void 0
            ? _b
            : 0,
        approved:
          (_d =
            (_c = rows.find((r) => r._id === 'approved')) === null || _c === void 0
              ? void 0
              : _c.n) !== null && _d !== void 0
            ? _d
            : 0,
        rejected:
          (_f =
            (_e = rows.find((r) => r._id === 'rejected')) === null || _e === void 0
              ? void 0
              : _e.n) !== null && _f !== void 0
            ? _f
            : 0,
      };
    });
  }
  listByStatus(status, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const docs = yield CourseSchema_1.Course.find({
        status,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .select('_id title code semester tutor status createdAt')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      return docs.map((d) => ({
        _id: String(d._id),
        title: d.title,
        code: d.code,
        semester: d.semester,
        tutor: String(d.tutor),
        status: d.status,
        createdAt: d.createdAt,
      }));
    });
  }
  findByIds(ids) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.find({ _id: { $in: ids } })
        .select('title code semester tutor status createdAt')
        .lean()
        .exec();
    });
  }
  countByStatusForTutor(tutorId) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const rows = yield CourseSchema_1.Course.aggregate([
        {
          $match: {
            tutor: new mongoose_1.Types.ObjectId(tutorId),
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        },
        { $group: { _id: '$status', n: { $sum: 1 } } },
      ]).exec();
      return {
        pending:
          (_b =
            (_a = rows.find((r) => r._id === 'pending')) === null || _a === void 0
              ? void 0
              : _a.n) !== null && _b !== void 0
            ? _b
            : 0,
        approved:
          (_d =
            (_c = rows.find((r) => r._id === 'approved')) === null || _c === void 0
              ? void 0
              : _c.n) !== null && _d !== void 0
            ? _d
            : 0,
        rejected:
          (_f =
            (_e = rows.find((r) => r._id === 'rejected')) === null || _e === void 0
              ? void 0
              : _e.n) !== null && _f !== void 0
            ? _f
            : 0,
      };
    });
  }
  listIdsByTutor(tutorId, statuses) {
    return __awaiter(this, void 0, void 0, function* () {
      const filter = {
        tutor: new mongoose_1.Types.ObjectId(tutorId),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      };
      if (statuses === null || statuses === void 0 ? void 0 : statuses.length)
        filter.status = { $in: statuses };
      const docs = yield CourseSchema_1.Course.find(filter).select('_id').lean().exec();
      return docs.map((d) => String(d._id));
    });
  }
  listPendingForTutor(tutorId, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const docs = yield CourseSchema_1.Course.find({
        tutor: new mongoose_1.Types.ObjectId(tutorId),
        status: 'pending',
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .select('_id title code semester createdAt')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      return docs.map((d) => ({
        _id: String(d._id),
        title: d.title,
        code: d.code,
        semester: d.semester,
        createdAt: d.createdAt,
      }));
    });
  }
  listByTutor(tutorId, opts) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const filter = {
        tutor: new mongoose_1.Types.ObjectId(tutorId),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      };
      if (opts === null || opts === void 0 ? void 0 : opts.status) filter.status = opts.status;
      const docs = yield CourseSchema_1.Course.find(filter)
        .select('_id title code semester status price createdAt')
        .sort({ createdAt: -1 })
        .skip(
          (_a = opts === null || opts === void 0 ? void 0 : opts.skip) !== null && _a !== void 0
            ? _a
            : 0,
        )
        .limit(
          (_b = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _b !== void 0
            ? _b
            : 20,
        )
        .lean()
        .exec();
      return docs.map((d) => ({
        _id: String(d._id),
        title: d.title,
        code: d.code,
        semester: d.semester,
        status: d.status,
        price: d.price,
        createdAt: d.createdAt,
      }));
    });
  }
  findActiveByIds(ids) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.find({
        _id: { $in: ids },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .select('_id title price thumbnailKey')
        .lean()
        .exec();
    });
  }
}
exports.CourseRepository = CourseRepository;
