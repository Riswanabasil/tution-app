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
exports.StudentLiveSessionService = void 0;
const mongoose_1 = require("mongoose");
class StudentLiveSessionService {
    constructor(liveRepo) {
        this.liveRepo = liveRepo;
    }
    listByTopic(topicId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = yield this.liveRepo.findByTopic(topicId, { status });
            return sessions.map(this.toStudentDTO);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const s = yield this.liveRepo.findById(id);
            return s ? this.toStudentDTO(s) : null;
        });
    }
    toStudentDTO(s) {
        return {
            _id: s._id.toString(),
            title: s.title,
            description: s.description,
            status: s.status,
            scheduledAt: s.scheduledAt,
            createdAt: s.createdAt,
        };
    }
}
exports.StudentLiveSessionService = StudentLiveSessionService;
