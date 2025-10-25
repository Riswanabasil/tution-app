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
const statusCode_1 = require('../../../constants/statusCode');
class ReviewController {
  constructor(svc) {
    this.svc = svc;
    this.create = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          const { courseId, rating, comment } = req.body;
          const studentId =
            ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.studentId;
          if (!courseId || !studentId || typeof rating === 'undefined') {
            res
              .status(statusCode_1.HttpStatus.BAD_REQUEST)
              .json({ message: 'courseId, studentId and rating are required' });
            return;
          }
          const r = Number(rating);
          if (!(r >= 1 && r <= 5)) {
            res
              .status(statusCode_1.HttpStatus.BAD_REQUEST)
              .json({ message: 'rating must be between 1 and 5' });
            return;
          }
          const created = yield this.svc.create({ courseId, studentId, rating: r, comment });
          res.status(statusCode_1.HttpStatus.CREATED).json(created);
          return;
        } catch (err) {
          console.error('createReview error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to create review' });
          return;
        }
      });
    this.getById = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const review = yield this.svc.getById(req.params.id);
          if (!review) {
            res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
            return;
          }
          res.json(review);
          return;
        } catch (err) {
          console.error('getReviewById error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch review' });
          return;
        }
      });
    this.listByCourse = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const page = Math.max(1, Number(req.query.page || 1));
          const limit = Math.max(1, Number(req.query.limit || 10));
          const data = yield this.svc.listByCourse(req.params.courseId, page, limit);
          res.json(data);
        } catch (err) {
          console.error('listCourseReviews error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch reviews' });
        }
      });
    this.update = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const updates = {};
          if (typeof req.body.rating !== 'undefined') {
            const r = Number(req.body.rating);
            if (!(r >= 1 && r <= 5)) {
              res
                .status(statusCode_1.HttpStatus.BAD_REQUEST)
                .json({ message: 'rating must be between 1 and 5' });
            }
            updates.rating = r;
          }
          if (typeof req.body.comment !== 'undefined') updates.comment = req.body.comment;
          if (!Object.keys(updates).length) {
            res.status(statusCode_1.HttpStatus.BAD_REQUEST).json({ message: 'Nothing to update' });
          }
          const updated = yield this.svc.update(req.params.id, updates);
          if (!updated)
            res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
          res.json(updated);
        } catch (err) {
          console.error('updateReview error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to update review' });
        }
      });
    this.remove = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const ok = yield this.svc.remove(req.params.id);
          if (!ok)
            res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
          res.status(statusCode_1.HttpStatus.NO_CONTENT).send();
        } catch (err) {
          console.error('deleteReview error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to delete review' });
        }
      });
    this.stats = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const stats = yield this.svc.stats(req.params.courseId);
          res.json(stats);
        } catch (err) {
          console.error('getCourseReviewStats error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch stats' });
        }
      });
    this.getMine = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
          if (!studentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
          }
          const review = yield this.svc.getByCourseAndStudent(req.params.courseId, studentId);
          res.json(review !== null && review !== void 0 ? review : null);
        } catch (err) {
          if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
            res.status(400).json({ message: 'Invalid course id' });
            return;
          }
          console.error('getMine review error:', err);
          res.status(500).json({ message: 'Failed to fetch my review' });
        }
      });
  }
}
exports.default = ReviewController;
