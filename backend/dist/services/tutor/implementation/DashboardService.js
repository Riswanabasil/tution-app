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
exports.TutorDashboardService = void 0;
const dashboard_1 = require('../../../utils/dashboard');
class TutorDashboardService {
  constructor(courses, enrollments, tutors) {
    this.courses = courses;
    this.enrollments = enrollments;
    this.tutors = tutors;
  }
  //  KPIs
  getKpis(tutorId, range) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      const r = (0, dashboard_1.resolveRange)(range);
      const [statusMap, approvedCourseIds, allCourseIds] = yield Promise.all([
        this.courses.countByStatusForTutor(tutorId),
        this.courses.listIdsByTutor(tutorId, ['approved']),
        this.courses.listIdsByTutor(tutorId),
      ]);
      const now = new Date();
      const todayRange = { from: (0, dashboard_1.startOfToday)(now), to: now };
      const mtdRange = { from: (0, dashboard_1.startOfMonth)(now), to: now };
      const [
        newEnrollments,
        activeStudents,
        revInRange,
        revToday,
        revMtd,
        walletBalance,
        paymentIssues24h,
      ] = yield Promise.all([
        this.enrollments.countPaidForCourses(r, approvedCourseIds),
        this.enrollments.countDistinctPaidUsersForCourses(r, approvedCourseIds),
        this.enrollments.sumPaidAmountForCourses(r, approvedCourseIds),
        this.enrollments.sumPaidAmountForCourses(todayRange, approvedCourseIds),
        this.enrollments.sumPaidAmountForCourses(mtdRange, approvedCourseIds),
        this.tutors.getWalletBalance(tutorId),
        this.enrollments.countFailedLast24hForCourses(now, approvedCourseIds),
      ]);
      return {
        courses: {
          pending: (_a = statusMap.pending) !== null && _a !== void 0 ? _a : 0,
          approved: (_b = statusMap.approved) !== null && _b !== void 0 ? _b : 0,
          rejected: (_c = statusMap.rejected) !== null && _c !== void 0 ? _c : 0,
        },
        newEnrollments,
        activeStudents,
        revenue: { today: revToday, mtd: revMtd, inRange: revInRange },
        walletBalance,
        paymentIssues24h,
      };
    });
  }
  // ---------- Charts ----------
  getRevenueTrend(tutorId, range, granularity) {
    return __awaiter(this, void 0, void 0, function* () {
      const courseIds = yield this.courses.listIdsByTutor(tutorId, ['approved']);
      return this.enrollments.revenueSeriesForCourses(range, granularity, courseIds);
    });
  }
  getEnrollmentTrend(tutorId, range, granularity) {
    return __awaiter(this, void 0, void 0, function* () {
      const courseIds = yield this.courses.listIdsByTutor(tutorId, ['approved']);
      return this.enrollments.enrollmentSeriesForCourses(range, granularity, courseIds);
    });
  }
  // ---------- Top courses table ----------
  getTopCourses(tutorId_1, range_1) {
    return __awaiter(this, arguments, void 0, function* (tutorId, range, limit = 5) {
      const courseIds = yield this.courses.listIdsByTutor(tutorId, ['approved']);
      if (!courseIds.length) return [];
      const stats = yield this.enrollments.topCoursesByPaidForCourses(range, courseIds, limit);
      if (stats.length === 0) return [];
      const ids = stats.map((s) => s.courseId);
      const courses = yield this.courses.findByIds(ids);
      const byId = new Map(courses.map((c) => [String(c._id), c]));
      return stats.map((s) => {
        var _a, _b, _c;
        const c = byId.get(s.courseId);
        return {
          courseId: s.courseId,
          title:
            (_a = c === null || c === void 0 ? void 0 : c.title) !== null && _a !== void 0
              ? _a
              : '(deleted)',
          code:
            (_b = c === null || c === void 0 ? void 0 : c.code) !== null && _b !== void 0
              ? _b
              : '-',
          semester:
            (_c = c === null || c === void 0 ? void 0 : c.semester) !== null && _c !== void 0
              ? _c
              : 0,
          enrollments: s.enrollments,
          revenue: s.revenue,
        };
      });
    });
  }
  // ---------- Recent enrollments table ----------
  getRecentEnrollments(tutorId_1, range_1) {
    return __awaiter(this, arguments, void 0, function* (tutorId, range, limit = 20) {
      const courseIds = yield this.courses.listIdsByTutor(tutorId, ['approved']);
      if (!courseIds.length) return [];
      return this.enrollments.recentPaidEnrollmentsForCourses(range, courseIds, limit);
    });
  }
  // ---------- My courses overview----------
  getMyCoursesOverview(tutorId, range, opts) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const list = yield this.courses.listByTutor(tutorId, {
        status: opts === null || opts === void 0 ? void 0 : opts.status,
        limit:
          (_a = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _a !== void 0
            ? _a
            : 50,
        skip:
          (_b = opts === null || opts === void 0 ? void 0 : opts.skip) !== null && _b !== void 0
            ? _b
            : 0,
      });
      const totalFilter = { tutor: tutorId };
      if (opts === null || opts === void 0 ? void 0 : opts.status) totalFilter.status = opts.status;
      const total = yield this.courses.countDocuments(totalFilter);
      const ids = list.map((c) => String(c._id));
      if (!ids.length) return { items: [], total };
      const stats = yield this.enrollments.topCoursesByPaidForCourses(range, ids, ids.length);
      const statMap = new Map(stats.map((s) => [s.courseId, s]));
      const items = list.map((c) => {
        var _a, _b;
        const s = statMap.get(String(c._id));
        return {
          courseId: String(c._id),
          title: c.title,
          code: c.code,
          semester: c.semester,
          status: c.status,
          price: c.price,
          createdAt: c.createdAt,
          enrollmentsInRange:
            (_a = s === null || s === void 0 ? void 0 : s.enrollments) !== null && _a !== void 0
              ? _a
              : 0,
          revenueInRange:
            (_b = s === null || s === void 0 ? void 0 : s.revenue) !== null && _b !== void 0
              ? _b
              : 0,
        };
      });
      return { items, total };
    });
  }
  // ---------- Pending approvals preview ----------
  getPendingApprovalsPreview(tutorId_1) {
    return __awaiter(this, arguments, void 0, function* (tutorId, limit = 6) {
      const rows = yield this.courses.listPendingForTutor(tutorId, limit);
      return rows.map((r) => ({
        courseId: String(r._id),
        title: r.title,
        code: r.code,
        semester: r.semester,
        createdAt: r.createdAt,
      }));
    });
  }
}
exports.TutorDashboardService = TutorDashboardService;
