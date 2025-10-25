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
exports.LiveSessionService = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
class LiveSessionService {
  constructor(liveRepo, topicRepo, moduleRepo, courseRepo) {
    this.liveRepo = liveRepo;
    this.topicRepo = topicRepo;
    this.moduleRepo = moduleRepo;
    this.courseRepo = courseRepo;
  }
  createSession(topicId, tutorId, data) {
    return __awaiter(this, void 0, void 0, function* () {
      const topic = yield this.topicRepo.findById(topicId);
      if (!topic) throw new Error('Topic not found');
      const moduleId = new mongoose_1.default.Types.ObjectId(topic.moduleId);
      const moduleDoc = yield this.moduleRepo.findById(moduleId);
      const courseId = moduleDoc === null || moduleDoc === void 0 ? void 0 : moduleDoc.courseId;
      const course = yield this.courseRepo.findById(courseId);
      if (!course) throw new Error('Course not found for topic');
      const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      const payload = {
        title: data.title,
        description: data.description,
        topicId,
        courseId,
        createdBy: tutorId,
        scheduledAt: data.scheduledAt,
        status: 'scheduled',
        roomCode,
      };
      return this.liveRepo.create(payload);
    });
  }
  listByTopic(topicId, status) {
    return this.liveRepo.findByTopic(topicId, { status });
  }
  getById(id) {
    return this.liveRepo.findById(id);
  }
  updateStatus(id, status) {
    return this.liveRepo.updateStatus(id, status);
  }
  delete(id) {
    return this.liveRepo.softDelete(id);
  }
}
exports.LiveSessionService = LiveSessionService;
