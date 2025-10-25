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
exports.VideoService = void 0;
const s3Presign_1 = require("../../../utils/s3Presign");
class VideoService {
    constructor(repo) {
        this.repo = repo;
    }
    create(data) {
        return this.repo.create({
            tutor: data.tutorId,
            topic: data.topicId,
            title: data.title,
            description: data.description,
            durationSec: data.durationSec,
            s3Key: data.key,
            contentType: data.contentType,
        });
    }
    listByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.repo.listByTopic(topicId);
            const plain = rows.map((v) => (v.toObject ? v.toObject() : v));
            return Promise.all(plain.map((v) => __awaiter(this, void 0, void 0, function* () {
                return (Object.assign(Object.assign({}, v), { url: v.s3Key ? yield (0, s3Presign_1.presignGetObject)(v.s3Key) : undefined }));
            })));
        });
    }
    update(id, data) {
        return this.repo.update(id, data);
    }
    softDelete(id) {
        return this.repo.softDelete(id);
    }
}
exports.VideoService = VideoService;
