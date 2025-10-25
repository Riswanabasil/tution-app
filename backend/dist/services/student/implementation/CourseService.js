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
exports.StudentCourseService = void 0;
const s3Presign_1 = require('../../../utils/s3Presign');
class StudentCourseService {
  constructor(courseRepo, moduleRepo, tutorRepo, topicRepo) {
    this.courseRepo = courseRepo;
    this.moduleRepo = moduleRepo;
    this.tutorRepo = tutorRepo;
    this.topicRepo = topicRepo;
  }
  listApproved(page_1, limit_1) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* (page, limit, search = '', semester, sortBy) {
        const skip = (page - 1) * limit;
        const filter = { status: 'approved', deletedAt: { $exists: false } };
        if (search) {
          const re = new RegExp(search, 'i');
          filter.$or = [{ title: re }, { code: re }, { details: re }];
        }
        if (semester !== undefined) {
          filter.semester = semester;
        }
        const sort = {};
        if (sortBy) {
          const isDescending = sortBy.startsWith('-');
          const field = isDescending ? sortBy.slice(1) : sortBy;
          sort[field] = isDescending ? -1 : 1;
        } else {
          sort['createdAt'] = -1;
        }
        const total = yield this.courseRepo.countDocuments(filter);
        const raw = yield this.courseRepo.findMany(filter, { skip, limit, sort });
        const courses = yield Promise.all(
          raw.map((c) =>
            __awaiter(this, void 0, void 0, function* () {
              const obj = c.toObject ? c.toObject() : c;
              obj.thumbnail = obj.thumbnailKey
                ? yield (0, s3Presign_1.presignGetObject)(obj.thumbnailKey)
                : undefined;
              return obj;
            }),
          ),
        );
        return {
          courses,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        };
      },
    );
  }
  fetchCourseWithModules(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      const course = yield this.courseRepo.findById(courseId);
      if (!course) throw new Error('Course not found');
      const modules = yield this.moduleRepo.findByCourse(courseId);
      const tutor = yield this.tutorRepo.getTutorById(course.tutor.toString());
      if (!tutor) throw new Error('Tutor not found');
      const obj = course.toObject ? course.toObject() : course;
      const thumbnail = obj.thumbnailKey
        ? yield (0, s3Presign_1.presignGetObject)(obj.thumbnailKey, { expiresIn: 600 })
        : undefined;
      const demoVideoUrl = obj.demoKey
        ? yield (0, s3Presign_1.presignGetObject)(obj.demoKey, { expiresIn: 600 })
        : undefined;
      const enrichedModules = yield Promise.all(
        modules.map((m) =>
          __awaiter(this, void 0, void 0, function* () {
            const topics = yield this.topicRepo.findByModule(m._id.toString());
            return {
              _id: m._id.toString(),
              name: m.name,
              order: m.order,
              topics: topics.map((t) => ({
                _id: t._id.toString(),
                title: t.title,
                description: t.description,
                order: t.order,
              })),
            };
          }),
        ),
      );
      return {
        _id: obj._id.toString(),
        title: obj.title,
        code: obj.code,
        semester: obj.semester,
        thumbnail,
        demoVideoUrl,
        price: obj.price,
        offer: obj.offer,
        actualPrice: obj.actualPrice,
        details: obj.details,
        tutorName: tutor.name,
        tutorProfilePic: tutor.profilePic,
        tutorEducation:
          ((_a = tutor.verificationDetails) === null || _a === void 0 ? void 0 : _a.education) ||
          '',
        tutorExperience:
          ((_b = tutor.verificationDetails) === null || _b === void 0 ? void 0 : _b.experience) ||
          '',
        tutorSummary:
          ((_c = tutor.verificationDetails) === null || _c === void 0 ? void 0 : _c.summary) || '',
        modules: enrichedModules,
      };
    });
  }
}
exports.StudentCourseService = StudentCourseService;
