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
const dashboard_1 = require('../../utils/dashboard');
const statusCode_1 = require('../../constants/statusCode');
const errorMessages_1 = require('../../constants/errorMessages');
class AdminDashboardController {
  constructor(svc) {
    this.svc = svc;
    this.getKpis = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const range =
            req.query.from || req.query.to ? (0, dashboard_1.parseDateRange)(req.query) : undefined;
          const data = yield this.svc.getKpis(range);
          res.json(data);
        } catch (err) {
          console.error('getKpis error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.getRevenueTrend = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const range = (0, dashboard_1.parseDateRange)(req.query);
          const granularity = (0, dashboard_1.parseGranularity)(req.query.granularity, 'daily');
          const data = yield this.svc.getRevenueTrend(range, granularity);
          res.json({ granularity, points: data });
        } catch (err) {
          console.error('getRevenueTrend error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.getEnrollmentTrend = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const range = (0, dashboard_1.parseDateRange)(req.query);
          const granularity = (0, dashboard_1.parseGranularity)(req.query.granularity, 'monthly');
          const data = yield this.svc.getEnrollmentTrend(range, granularity);
          res.json({ granularity, points: data });
        } catch (err) {
          console.error('getEnrollmentTrend error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.getTopCourses = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const range = (0, dashboard_1.parseDateRange)(req.query);
          const limit = (0, dashboard_1.parseLimit)(req.query.limit, 5);
          const rows = yield this.svc.getTopCourses(range, limit);
          res.json({ limit, rows });
        } catch (err) {
          console.error('getTopCourses error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch top courses' });
        }
      });
    this.getApprovalQueues = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const limit = (0, dashboard_1.parseLimit)(req.query.limit, 10);
          const data = yield this.svc.getApprovalQueues(limit);
          res.json(Object.assign({ limit }, data));
        } catch (err) {
          console.error('getApprovalQueues error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch approval queues' });
        }
      });
  }
}
exports.default = AdminDashboardController;
