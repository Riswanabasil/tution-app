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
exports.TutorDashboardController = void 0;
const dashboard_1 = require("../../../utils/dashboard");
const statusCode_1 = require("../../../constants/statusCode");
class TutorDashboardController {
    constructor(svc) {
        this.svc = svc;
        this.getKpis = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const range = req.query.from || req.query.to ? (0, dashboard_1.parseDateRange)(req.query) : undefined;
                const data = yield this.svc.getKpis(tutorId, range);
                res.json(data);
            }
            catch (err) {
                console.error('tutor.getKpis', err);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch tutor KPIs' });
            }
        });
        this.getRevenueTrend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const range = (0, dashboard_1.parseDateRange)(req.query);
                const granularity = (0, dashboard_1.parseGranularity)(req.query.granularity, 'daily');
                const points = yield this.svc.getRevenueTrend(tutorId, range, granularity);
                res.json({ granularity, points });
            }
            catch (err) {
                console.error('tutor.getRevenueTrend', err);
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch revenue trend' });
            }
        });
        this.getEnrollmentTrend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const range = (0, dashboard_1.parseDateRange)(req.query);
                const granularity = (0, dashboard_1.parseGranularity)(req.query.granularity, 'monthly');
                const points = yield this.svc.getEnrollmentTrend(tutorId, range, granularity);
                res.json({ granularity, points });
            }
            catch (err) {
                console.error('tutor.getEnrollmentTrend', err);
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch enrollment trend' });
            }
        });
        this.getTopCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const range = (0, dashboard_1.parseDateRange)(req.query);
                const limit = (0, dashboard_1.parseLimit)(req.query.limit, 5);
                const rows = yield this.svc.getTopCourses(tutorId, range, limit);
                res.json({ limit, rows });
            }
            catch (err) {
                console.error('tutor.getTopCourses', err);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch top courses' });
            }
        });
        this.getRecentEnrollments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const range = (0, dashboard_1.parseDateRange)(req.query);
                const limit = (0, dashboard_1.parseLimit)(req.query.limit, 20);
                const rows = yield this.svc.getRecentEnrollments(tutorId, range, limit);
                res.json({ limit, rows });
            }
            catch (err) {
                console.error('tutor.getRecentEnrollments', err);
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch recent enrollments' });
            }
        });
        this.getMyCoursesOverview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tutorId = req.user.id;
                const range = (0, dashboard_1.parseDateRange)(req.query);
                const status = req.query.status;
                const limit = (0, dashboard_1.parseLimit)(req.query.limit, 50);
                const skip = Number((_a = req.query.skip) !== null && _a !== void 0 ? _a : 0) || 0;
                const result = yield this.svc.getMyCoursesOverview(tutorId, range, {
                    status,
                    limit,
                    skip,
                });
                res.json(result);
            }
            catch (err) {
                console.error('tutor.getMyCoursesOverview', err);
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch courses overview' });
            }
        });
        this.getPendingApprovalsPreview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.user.id;
                const limit = (0, dashboard_1.parseLimit)(req.query.limit, 6);
                const rows = yield this.svc.getPendingApprovalsPreview(tutorId, limit);
                res.json({ limit, rows });
            }
            catch (err) {
                console.error('tutor.getPendingApprovalsPreview', err);
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch pending approvals' });
            }
        });
    }
}
exports.TutorDashboardController = TutorDashboardController;
