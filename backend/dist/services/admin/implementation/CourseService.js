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
exports.AdminCourseService = void 0;
const SendEmail_1 = require("../../../utils/SendEmail");
class AdminCourseService {
    constructor(courseRepo, tutorRepo) {
        this.courseRepo = courseRepo;
        this.tutorRepo = tutorRepo;
    }
    listPaginated(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = { deletedAt: { $exists: false } };
            if (status)
                filter.status = status;
            if (search) {
                const re = new RegExp(search, 'i');
                filter.$or = [{ title: re }, { code: re }, { details: re }];
            }
            const [courses, total] = yield Promise.all([
                this.courseRepo.findMany(filter, {
                    skip,
                    limit,
                    sort: { createdAt: -1 },
                }),
                this.courseRepo.countDocuments(filter),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { courses, total, page, limit, totalPages };
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.courseRepo.update(id, { status });
            if (!updated) {
                throw new Error('Course not found');
            }
            const tutor = yield this.tutorRepo.findById(updated.tutor.toString());
            if (tutor === null || tutor === void 0 ? void 0 : tutor.email) {
                yield (0, SendEmail_1.sendCourseStatusEmail)(tutor.email, updated.title, status);
            }
            return updated;
        });
    }
}
exports.AdminCourseService = AdminCourseService;
