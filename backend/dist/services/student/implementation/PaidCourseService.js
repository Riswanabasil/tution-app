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
exports.PaidCourseService = void 0;
const s3Presign_1 = require("../../../utils/s3Presign");
class PaidCourseService {
    constructor(moduleRepository, topicRepository, noteRepository) {
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.noteRepository = noteRepository;
    }
    getModulesByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.moduleRepository.findByCourse(courseId);
        });
    }
    getTopicsByModuleId(moduleId_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (moduleId, search, page = 1, limit = 10) {
            const filter = {
                moduleId,
                isDeleted: false,
            };
            if (search) {
                filter.title = { $regex: search, $options: 'i' };
            }
            return this.topicRepository.findWithFilter(filter, page, limit);
        });
    }
    // async getNotesByTopic(topicId: string) {
    //   return await this.noteRepository.findByTopic(topicId);
    // }
    getNotesByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.noteRepository.findByTopic(topicId);
            const enriched = yield Promise.all(rows.map((n) => __awaiter(this, void 0, void 0, function* () {
                const url = yield (0, s3Presign_1.presignGetObject)(n.pdfKey);
                return Object.assign(Object.assign({}, n), { pdfUrls: url ? [url] : [] });
            })));
            return enriched;
        });
    }
}
exports.PaidCourseService = PaidCourseService;
