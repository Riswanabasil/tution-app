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
exports.StudentLiveSessionController = void 0;
const statusCode_1 = require("../../../constants/statusCode");
class StudentLiveSessionController {
    constructor(service) {
        this.service = service;
        this.listByTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { topicId } = req.params;
                const { status } = req.query;
                const sessions = yield this.service.listByTopic(topicId, status);
                res.json(sessions);
            }
            catch (err) {
                console.error(err);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch sessions' });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const session = yield this.service.getById(id);
                if (!session)
                    res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Session not found' });
                res.json(session);
            }
            catch (err) {
                console.error(err);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch session' });
            }
        });
    }
}
exports.StudentLiveSessionController = StudentLiveSessionController;
