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
exports.AdminCourseController = void 0;
class AdminCourseController {
    constructor(service) {
        this.service = service;
        this.listAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(1, parseInt(req.query.page) || 1);
                const limit = Math.max(1, parseInt(req.query.limit) || 10);
                const status = req.query.status || undefined;
                const search = req.query.search || undefined;
                const result = yield this.service.listPaginated(page, limit, status, search);
                res.json(result);
            }
            catch (err) {
                next(err);
            }
        });
        this.updateStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const { status } = req.body;
                const updated = yield this.service.updateStatus(courseId, status);
                res.json({ updated });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AdminCourseController = AdminCourseController;
