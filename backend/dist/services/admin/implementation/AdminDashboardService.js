"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const dashboard_1 = require("../../../utils/dashboard");
class AdminDashboardService {
    constructor(students, tutors, courses, enrollments) {
        this.students = students;
        this.tutors = tutors;
        this.courses = courses;
        this.enrollments = enrollments;
    }
    getKpis(range) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const r = (0, dashboard_1.resolveRange)(range);
            const [totalStudents, verifiedStudents, activeStudents, courseStatusMap, tutorStatusMap, revenueInRange, revenueToday, revenueMtd, failedPayments24h,] = yield Promise.all([
                this.students.countAll(),
                this.students.countVerified(),
                this.enrollments.countDistinctPaidUsersInRange(r),
                this.courses.countByStatusMap(),
                this.tutors.countByStatusMap(),
                this.enrollments.sumPaidAmountInRange(r),
                this.enrollments.sumPaidAmountToday((0, dashboard_1.startOfToday)()),
                this.enrollments.sumPaidAmountMonthToDate(new Date()),
                this.enrollments.countFailedLast24h(),
            ]);
            const tutors = {
                pending: (_a = tutorStatusMap['pending']) !== null && _a !== void 0 ? _a : 0,
                'verification-submitted': (_b = tutorStatusMap['verification-submitted']) !== null && _b !== void 0 ? _b : 0,
                approved: (_c = tutorStatusMap['approved']) !== null && _c !== void 0 ? _c : 0,
                rejected: (_d = tutorStatusMap['rejected']) !== null && _d !== void 0 ? _d : 0,
            };
            const courses = {
                pending: (_e = courseStatusMap['pending']) !== null && _e !== void 0 ? _e : 0,
                approved: (_f = courseStatusMap['approved']) !== null && _f !== void 0 ? _f : 0,
                rejected: (_g = courseStatusMap['rejected']) !== null && _g !== void 0 ? _g : 0,
            };
            return {
                totalStudents,
                verifiedStudents,
                activeStudents,
                courses,
                tutors,
                revenue: { today: revenueToday, mtd: revenueMtd, inRange: revenueInRange },
                failedPayments24h,
            };
        });
    }
    getRevenueTrend(range, granularity) {
        return this.enrollments.revenueSeries(range, granularity);
    }
    getEnrollmentTrend(range, granularity) {
        return this.enrollments.enrollmentSeries(range, granularity);
    }
    getTopCourses(range_1) {
        return __awaiter(this, arguments, void 0, function* (range, limit = 5) {
            const top = yield this.enrollments.topCoursesByPaid(range, limit);
            if (top.length === 0)
                return [];
            const courseIds = top.map((t) => t.courseId);
            const courseDocs = yield this.courses.findByIds(courseIds);
            const tutorIds = Array.from(new Set(courseDocs.map((c) => String(c.tutor))));
            const tutorDocs = yield this.tutors.findByIds(tutorIds);
            const tutorNameMap = new Map(tutorDocs.map((t) => [String(t._id), t.name]));
            const courseMap = new Map(courseDocs.map((c) => [String(c._id), c]));
            return top.map((row) => {
                var _a, _b, _c, _d, _e;
                const c = courseMap.get(row.courseId);
                return {
                    courseId: row.courseId,
                    title: (_a = c === null || c === void 0 ? void 0 : c.title) !== null && _a !== void 0 ? _a : '(deleted)',
                    code: (_b = c === null || c === void 0 ? void 0 : c.code) !== null && _b !== void 0 ? _b : '-',
                    semester: (_c = c === null || c === void 0 ? void 0 : c.semester) !== null && _c !== void 0 ? _c : 0,
                    tutorId: String((_d = c === null || c === void 0 ? void 0 : c.tutor) !== null && _d !== void 0 ? _d : ''),
                    tutorName: (c === null || c === void 0 ? void 0 : c.tutor) ? tutorNameMap.get(String(c.tutor)) : undefined,
                    status: ((_e = c === null || c === void 0 ? void 0 : c.status) !== null && _e !== void 0 ? _e : 'rejected'),
                    enrollments: row.enrollments,
                    revenue: row.revenue,
                };
            });
        });
    }
    getApprovalQueues() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const [courses, tutors] = yield Promise.all([
                this.courses.listByStatus('pending', limit),
                this.tutors.listByStatuses(['pending', 'verification-submitted'], limit),
            ]);
            const tutorIds = Array.from(new Set(courses.map((c) => String(c.tutor))));
            const tutorDocs = tutorIds.length ? yield this.tutors.findByIds(tutorIds) : [];
            const tutorMap = new Map(tutorDocs.map((t) => [String(t._id), t.name]));
            const pendingCourses = courses.map((c) => ({
                courseId: String(c._id),
                title: c.title,
                code: c.code,
                semester: c.semester,
                tutorId: String(c.tutor),
                tutorName: tutorMap.get(String(c.tutor)),
                createdAt: c.createdAt,
            }));
            const pendingTutors = tutors.map((t) => ({
                tutorId: String(t._id),
                name: t.name,
                email: t.email,
                status: t.status,
                createdAt: t.createdAt,
            }));
            return { pendingCourses, pendingTutors };
        });
    }
}
exports.AdminDashboardService = AdminDashboardService;
