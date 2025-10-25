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
exports.PaidCourseController = void 0;
const statusCode_1 = require("../../../constants/statusCode");
class PaidCourseController {
    constructor(paidCourseService) {
        this.paidCourseService = paidCourseService;
        this.getModulesByCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const modules = yield this.paidCourseService.getModulesByCourseId(courseId);
                res.status(statusCode_1.HttpStatus.OK).json(modules);
            }
            catch (error) {
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Failed to fetch modules', error });
            }
        });
    }
    getTopicsByModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { moduleId } = req.params;
                const { search = '', page = '1', limit = '5' } = req.query;
                const result = yield this.paidCourseService.getTopicsByModuleId(moduleId, String(search), parseInt(page), parseInt(limit));
                res.json(result);
            }
            catch (err) {
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch topics', err });
            }
        });
    }
    // async getNotes(req: Request, res: Response) {
    //   try {
    //     const { topicId } = req.params;
    //     const notes = await this.paidCourseService.getNotesByTopic(topicId);
    //     res.json(notes);
    //   } catch (err) {
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch notes' });
    //   }
    // }
    getNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { topicId } = req.params;
                const notes = yield this.paidCourseService.getNotesByTopic(topicId);
                res.json(notes);
            }
            catch (err) {
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch notes' });
            }
        });
    }
}
exports.PaidCourseController = PaidCourseController;
