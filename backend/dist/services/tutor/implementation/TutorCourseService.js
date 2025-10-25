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
exports.TutorCourseService = void 0;
class TutorCourseService {
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }
    createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseRepo.create(data);
        });
    }
    getAllCourses(tutorId_1, page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (tutorId, page, limit, search = '') {
            const skip = (page - 1) * limit;
            const filter = { tutor: tutorId, deletedAt: { $exists: false } };
            if (search) {
                const re = new RegExp(search, 'i');
                filter.$or = [{ title: re }, { code: re }, { details: re }];
            }
            const total = yield this.courseRepo.countDocuments(filter);
            const courses = yield this.courseRepo.findMany(filter, {
                skip,
                limit,
                sort: { createdAt: -1 },
            });
            return {
                courses,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getCourseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseRepo.findById(id);
        });
    }
    updateCourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseRepo.update(id, data);
        });
    }
    softDeleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseRepo.softDelete(id);
        });
    }
    reapply(courseId, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepo.findById(courseId);
            if (!course)
                throw new Error('Course not found');
            if (course.tutor.toString() !== tutorId)
                throw new Error('Unauthorized');
            course.status = 'pending';
            return yield course.save();
        });
    }
}
exports.TutorCourseService = TutorCourseService;
