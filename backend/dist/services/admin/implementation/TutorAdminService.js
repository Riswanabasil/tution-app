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
exports.TutorAdminService = void 0;
const s3Presign_1 = require("../../../utils/s3Presign");
class TutorAdminService {
    constructor(tutorRepo) {
        this.tutorRepo = tutorRepo;
    }
    getAllTutors(page, limit, status, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const query = {};
            if (status)
                query.status = status;
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            const total = yield this.tutorRepo.countAllWithFilters(query);
            const tutorsRaw = yield this.tutorRepo.getAllWithFilters(query, skip, limit);
            const tutors = tutorsRaw.map((t) => ({
                _id: t._id.toString(),
                id: t._id.toString(),
                name: t.name,
                email: t.email,
                status: t.status,
                // assignedCourses: t.assignedCourses.map(id => id.toString())
            }));
            return {
                tutors,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getTutorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const t = yield this.tutorRepo.getTutorById(id);
            if (!t)
                throw new Error('Tutor not found');
            const vd = ((_a = t.verificationDetails) !== null && _a !== void 0 ? _a : {});
            const [idProofUrl, resumeUrl] = yield Promise.all([
                (0, s3Presign_1.presignGetObject)(vd.idProof),
                (0, s3Presign_1.presignGetObject)(vd.resume),
            ]);
            return {
                id: t._id.toString(),
                name: t.name,
                email: t.email,
                phone: t.phone,
                isGoogleSignup: t.isGoogleSignup,
                status: t.status,
                // assignedCourses: t.assignedCourses.map(id => id.toString()),
                verificationDetails: Object.assign(Object.assign({}, vd), { idProof: idProofUrl, resume: resumeUrl }),
            };
        });
    }
    updateTutorStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowed = ['approved', 'rejected'];
            if (!allowed.includes(status))
                throw new Error('Invalid status');
            const success = yield this.tutorRepo.updateTutorStatus(id, status);
            if (!success)
                throw new Error('Tutor not found');
        });
    }
}
exports.TutorAdminService = TutorAdminService;
