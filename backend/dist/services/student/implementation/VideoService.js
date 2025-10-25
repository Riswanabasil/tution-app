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
exports.StudentVideoService = void 0;
const VideoSchema_1 = __importDefault(require("../../../models/video/VideoSchema"));
const s3Presign_1 = require("../../../utils/s3Presign");
class StudentVideoService {
    constructor(progressRepo) {
        this.progressRepo = progressRepo;
    }
    listByTopicForStudent(topicId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield this.progressRepo.listByTopicPublic(topicId);
            if (videos.length === 0)
                return [];
            const withUrls = yield Promise.all(videos.map((v) => __awaiter(this, void 0, void 0, function* () {
                const url = v.s3Key ? yield (0, s3Presign_1.presignGetObject)(v.s3Key) : undefined;
                return Object.assign(Object.assign({}, v), { url });
            })));
            const progresses = yield this.progressRepo.findByStudentAndVideoIds(studentId, withUrls.map((v) => String(v._id)));
            const map = new Map(progresses.map((p) => [String(p.video), p]));
            return withUrls.map((v) => (Object.assign(Object.assign({}, v), { progress: map.get(String(v._id))
                    ? {
                        lastPositionSec: map.get(String(v._id)).lastPositionSec,
                        totalWatchedSec: map.get(String(v._id)).totalWatchedSec,
                        percent: map.get(String(v._id)).percent,
                        completed: map.get(String(v._id)).completed,
                    }
                    : { lastPositionSec: 0, totalWatchedSec: 0, percent: 0, completed: false } })));
        });
    }
    upsertProgress(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // prefer DB duration if present
            const video = yield VideoSchema_1.default.findById(input.videoId).select('durationSec');
            return this.progressRepo.upsertAndMerge({
                studentId: input.studentId,
                videoId: input.videoId,
                addRanges: input.ranges,
                lastPositionSec: input.lastPositionSec,
                durationSecHint: input.durationSecHint,
                durationSecDb: (_a = video === null || video === void 0 ? void 0 : video.durationSec) !== null && _a !== void 0 ? _a : undefined,
            });
        });
    }
}
exports.StudentVideoService = StudentVideoService;
