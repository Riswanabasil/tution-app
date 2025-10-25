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
exports.ReviewService = void 0;
class ReviewService {
  constructor(repo) {
    this.repo = repo;
  }
  create(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.repo.create(payload);
    });
  }
  getById(id) {
    return this.repo.findById(id);
  }
  listByCourse(courseId, page, limit) {
    return this.repo.listByCoursePaginated(courseId, page, limit);
  }
  update(id, updates) {
    return this.repo.update(id, updates);
  }
  remove(id) {
    return this.repo.softDelete(id);
  }
  stats(courseId) {
    return this.repo.statsByCourse(courseId);
  }
  getByCourseAndStudent(courseId, studentId) {
    return this.repo.findByCourseAndStudent(courseId, studentId);
  }
}
exports.ReviewService = ReviewService;
