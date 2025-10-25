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
exports.EnrollmentRepository = void 0;
const Enrollment_1 = require('../../../models/payment/Enrollment');
const BaseRepository_1 = require('../../base/BaseRepository');
const enrollment_1 = require('../../../utils/enrollment');
class EnrollmentRepository extends BaseRepository_1.BaseRepository {
  constructor() {
    super(Enrollment_1.EnrollmentModel);
  }
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.create(data);
    });
  }
  updateStatus(orderId, status) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status },
        { new: true },
      );
    });
  }
  findByOrderId(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.findOne({ razorpayOrderId: id });
    });
  }
  updateById(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.findByIdAndUpdate(id, { status }, { new: true });
    });
  }
  findPaidByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.find({ userId: userId, status: 'paid' })
        .sort({ createdAt: -1 })
        .populate('courseId', 'title thumbnailKey thumbnail price')
        .exec();
    });
  }
  findPaymentHistory(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate('courseId', 'title thumbnail price')
        .exec();
    });
  }
  countPaidByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      return Enrollment_1.EnrollmentModel.countDocuments({ userId, status: 'paid' }).exec();
    });
  }
  countDistinctPaidUsersInRange(range) {
    return __awaiter(this, void 0, void 0, function* () {
      const ids = yield Enrollment_1.EnrollmentModel.distinct('userId', {
        status: 'paid',
        createdAt: { $gte: range.from, $lte: range.to },
      });
      return ids.length;
    });
  }
  sumPaidAmountInRange(range) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const res = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: range.from, $lte: range.to } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).exec();
      return (_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) !== null &&
        _b !== void 0
        ? _b
        : 0;
    });
  }
  sumPaidAmountToday() {
    return __awaiter(this, arguments, void 0, function* (now = new Date()) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      return this.sumPaidAmountInRange({ from: start, to: end });
    });
  }
  sumPaidAmountMonthToDate() {
    return __awaiter(this, arguments, void 0, function* (now = new Date()) {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return this.sumPaidAmountInRange({ from: start, to: now });
    });
  }
  countFailedLast24h() {
    return __awaiter(this, arguments, void 0, function* (now = new Date()) {
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return Enrollment_1.EnrollmentModel.countDocuments({
        status: 'failed',
        createdAt: { $gte: from, $lte: now },
      }).exec();
    });
  }
  revenueSeries(range, by) {
    return __awaiter(this, void 0, void 0, function* () {
      const format = by === 'daily' ? '%Y-%m-%d' : '%Y-%m';
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: range.from, $lte: range.to } } },
        {
          $group: {
            _id: { $dateToString: { format, date: '$createdAt' } },
            value: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]).exec();
      return rows.map((r) => ({ period: r._id, value: r.value }));
    });
  }
  enrollmentSeries(range, by) {
    return __awaiter(this, void 0, void 0, function* () {
      const format = by === 'daily' ? '%Y-%m-%d' : '%Y-%m';
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: range.from, $lte: range.to } } },
        {
          $group: {
            _id: { $dateToString: { format, date: '$createdAt' } },
            value: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]).exec();
      return rows.map((r) => ({ period: r._id, value: r.value }));
    });
  }
  topCoursesByPaid(range, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: range.from, $lte: range.to } } },
        {
          $group: {
            _id: '$courseId',
            enrollments: { $sum: 1 },
            revenue: { $sum: '$amount' },
          },
        },
        { $sort: { enrollments: -1, revenue: -1 } },
        { $limit: limit },
      ]).exec();
      return rows.map((r) => ({
        courseId: String(r._id),
        enrollments: r.enrollments,
        revenue: r.revenue,
      }));
    });
  }
  sumPaidAmountForCourses(range, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      if (!courseIds.length) return 0;
      const res = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: (0, enrollment_1.matchPaid)(range, courseIds) },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).exec();
      return (_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.total) !== null &&
        _b !== void 0
        ? _b
        : 0;
    });
  }
  revenueSeriesForCourses(range, by, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return [];
      const format = by === 'daily' ? '%Y-%m-%d' : '%Y-%m';
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: (0, enrollment_1.matchPaid)(range, courseIds) },
        {
          $group: {
            _id: { $dateToString: { format, date: '$createdAt' } },
            value: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]).exec();
      return rows.map((r) => ({ period: r._id, value: r.value }));
    });
  }
  enrollmentSeriesForCourses(range, by, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return [];
      const format = by === 'daily' ? '%Y-%m-%d' : '%Y-%m';
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: (0, enrollment_1.matchPaid)(range, courseIds) },
        { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, value: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]).exec();
      return rows.map((r) => ({ period: r._id, value: r.value }));
    });
  }
  topCoursesByPaidForCourses(range, courseIds, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return [];
      const rows = yield Enrollment_1.EnrollmentModel.aggregate([
        { $match: (0, enrollment_1.matchPaid)(range, courseIds) },
        { $group: { _id: '$courseId', enrollments: { $sum: 1 }, revenue: { $sum: '$amount' } } },
        { $sort: { enrollments: -1, revenue: -1 } },
        { $limit: limit },
      ]).exec();
      return rows.map((r) => ({
        courseId: String(r._id),
        enrollments: r.enrollments,
        revenue: r.revenue,
      }));
    });
  }
  countDistinctPaidUsersForCourses(range, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return 0;
      const ids = yield Enrollment_1.EnrollmentModel.distinct(
        'userId',
        (0, enrollment_1.matchPaid)(range, courseIds),
      );
      return ids.length;
    });
  }
  countPaidForCourses(range, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return 0;
      return Enrollment_1.EnrollmentModel.countDocuments(
        (0, enrollment_1.matchPaid)(range, courseIds),
      ).exec();
    });
  }
  countFailedLast24hForCourses(now, courseIds) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return 0;
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return Enrollment_1.EnrollmentModel.countDocuments({
        status: { $in: ['failed', 'pending'] },
        courseId: { $in: (0, enrollment_1.toObjectIds)(courseIds) },
        createdAt: { $gte: from, $lte: now },
      }).exec();
    });
  }
  recentPaidEnrollmentsForCourses(range, courseIds, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!courseIds.length) return [];
      const docs = yield Enrollment_1.EnrollmentModel.find(
        (0, enrollment_1.matchPaid)(range, courseIds),
      )
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({ path: 'userId', select: 'name email' })
        .populate({ path: 'courseId', select: 'title code' })
        .lean()
        .exec();
      return docs.map((d) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
          date: new Date(d.createdAt).toISOString(),
          studentName:
            (_b = (_a = d.userId) === null || _a === void 0 ? void 0 : _a.name) !== null &&
            _b !== void 0
              ? _b
              : '',
          studentEmail:
            (_d = (_c = d.userId) === null || _c === void 0 ? void 0 : _c.email) !== null &&
            _d !== void 0
              ? _d
              : '',
          courseId: String(
            (_f = (_e = d.courseId) === null || _e === void 0 ? void 0 : _e._id) !== null &&
              _f !== void 0
              ? _f
              : d.courseId,
          ),
          courseTitle:
            (_h = (_g = d.courseId) === null || _g === void 0 ? void 0 : _g.title) !== null &&
            _h !== void 0
              ? _h
              : '',
          courseCode:
            (_k = (_j = d.courseId) === null || _j === void 0 ? void 0 : _j.code) !== null &&
            _k !== void 0
              ? _k
              : '',
          amount: d.amount,
        };
      });
    });
  }
  upsertPending(userId, courseId, amount, razorpayOrderId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return yield Enrollment_1.EnrollmentModel.findOneAndUpdate(
          { userId, courseId, status: 'pending' },
          {
            $set: { amount, razorpayOrderId, status: 'pending' },
            $setOnInsert: { userId, courseId },
          },
          { new: true, upsert: true },
        ).exec();
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === 11000) {
          throw new Error('You already own this course');
        }
        throw e;
      }
    });
  }
  isPurchased(userId, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
      return !!(yield Enrollment_1.EnrollmentModel.exists({
        userId,
        courseId,
        status: 'paid',
      }).lean());
    });
  }
}
exports.EnrollmentRepository = EnrollmentRepository;
