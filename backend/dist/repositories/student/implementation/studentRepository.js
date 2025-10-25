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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const studentSchema_1 = __importDefault(require("../../../models/student/studentSchema"));
const BaseRepository_1 = require("../../base/BaseRepository");
class StudentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(studentSchema_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.findOne({ email });
        });
    }
    updateIsVerified(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield studentSchema_1.default.updateOne({ email }, { isVerified: true });
        });
    }
    countDocuments(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.countDocuments(filter);
        });
    }
    findMany(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.find(filter)
                .skip(options.skip || 0)
                .limit(options.limit || 0)
                .sort(options.sort || {});
        });
    }
    updateBlockStatus(id, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            yield studentSchema_1.default.findByIdAndUpdate(id, { isBlocked });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.findById(id).exec();
        });
    }
    updateById(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.findByIdAndUpdate(id, updates, { new: true }).select('-password').exec();
        });
    }
    changePassword(id, newHashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.findByIdAndUpdate(id, { password: newHashedPassword }, { new: true })
                .select('-password')
                .exec();
        });
    }
    updatePasswordByEmail(email, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield studentSchema_1.default.updateOne({ email }, { $set: { password: passwordHash } });
            if (res.matchedCount === 0) {
                throw new Error('Account not found');
            }
        });
    }
    countAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.countDocuments({});
        });
    }
    countVerified() {
        return __awaiter(this, void 0, void 0, function* () {
            return studentSchema_1.default.countDocuments({ isVerified: true });
        });
    }
    getAuthStateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield studentSchema_1.default.findById(id)
                .select('isBlocked')
                .lean();
            return doc ? { isBlocked: !!doc.isBlocked } : null;
        });
    }
}
exports.StudentRepository = StudentRepository;
