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
exports.StudentAdminService = void 0;
class StudentAdminService {
    constructor(studentRepo) {
        this.studentRepo = studentRepo;
    }
    getAllStudents(page, limit, search, sort, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = search
                ? {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ],
                }
                : {};
            const total = yield this.studentRepo.countDocuments(filter);
            const students = yield this.studentRepo.findMany(filter, {
                skip,
                limit,
                sort: { [sort]: order },
            });
            return { students, totalPages: Math.ceil(total / limit) };
        });
    }
    blockStudent(studentId, block) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.studentRepo.updateBlockStatus(studentId, block);
        });
    }
}
exports.StudentAdminService = StudentAdminService;
