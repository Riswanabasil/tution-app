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
exports.StudentCourseController = void 0;
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class StudentCourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }
  list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const search = req.query.search || '';
        const semester = req.query.semester ? parseInt(req.query.semester) : undefined;
        const sortBy = req.query.sortBy || '';
        const result = yield this.courseService.listApproved(page, limit, search, semester, sortBy);
        res.json(result);
      } catch (err) {
        console.error('Student course list error:', err);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  getCourseDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { courseId } = req.params;
        const details = yield this.courseService.fetchCourseWithModules(courseId);
        res.json(details);
      } catch (err) {
        console.error(err);
        res
          .status(statusCode_1.HttpStatus.NOT_FOUND)
          .json({ message: errorMessages_1.ERROR_MESSAGES.NOT_FOUND });
      }
    });
  }
}
exports.StudentCourseController = StudentCourseController;
