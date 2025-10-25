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
exports.NoteService = void 0;
const s3Presign_1 = require("../../../utils/s3Presign");
class NoteService {
    constructor(repo) {
        this.repo = repo;
    }
    create(data) {
        return this.repo.create(data);
    }
    getByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = yield this.repo.findByTopic(topicId);
            return Promise.all(notes.map((n) => __awaiter(this, void 0, void 0, function* () {
                const url = yield (0, s3Presign_1.presignGetObject)(n.pdfKey);
                return Object.assign(Object.assign({}, n), { pdfUrls: url ? [url] : [] });
            })));
        });
    }
    getById(id) {
        return this.repo.findById(id);
    }
    update(id, data) {
        return this.repo.update(id, data);
    }
    delete(id) {
        return this.repo.delete(id);
    }
}
exports.NoteService = NoteService;
