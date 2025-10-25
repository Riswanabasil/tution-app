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
exports.VideoRepository = void 0;
const mongoose_1 = require("mongoose");
const VideoSchema_1 = __importDefault(require("../../../models/video/VideoSchema"));
const BaseRepository_1 = require("../../base/BaseRepository");
class VideoRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(VideoSchema_1.default);
    }
    // async listByTopic(topicId: string): Promise<IVideo[]> {
    //   return Video.find({ topic: new Types.ObjectId(topicId), isDeleted: false }).sort({
    //     createdAt: -1,
    //   });
    // }
    listByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            return VideoSchema_1.default.find({ topic: new mongoose_1.Types.ObjectId(topicId), isDeleted: false })
                .sort({ createdAt: -1 })
                .select('_id tutor topic title description durationSec s3Key contentType createdAt updatedAt')
                .lean()
                .exec();
        });
    }
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield VideoSchema_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            return !!res;
        });
    }
}
exports.VideoRepository = VideoRepository;
