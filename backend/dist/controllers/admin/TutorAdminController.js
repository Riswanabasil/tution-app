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
exports.TutorAdminController = void 0;
const statusCode_1 = require("../../constants/statusCode");
const errorMessages_1 = require("../../constants/errorMessages");
class TutorAdminController {
    constructor(service) {
        this.service = service;
    }
    getAllTutors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const status = req.query.status;
                const search = req.query.search;
                const result = yield this.service.getAllTutors(page, limit, status, search);
                res.status(statusCode_1.HttpStatus.OK).json(result);
            }
            catch (err) {
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getTutorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const tutor = yield this.service.getTutorById(id);
                res.status(statusCode_1.HttpStatus.OK).json(tutor);
            }
            catch (err) {
                res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Tutor not found' });
            }
        });
    }
    updateTutorStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { status } = req.body;
                yield this.service.updateTutorStatus(id, status);
                res.status(statusCode_1.HttpStatus.OK).json({ message: 'Tutor status updated' });
            }
            catch (err) {
                res.status(statusCode_1.HttpStatus.BAD_REQUEST).json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
            }
        });
    }
}
exports.TutorAdminController = TutorAdminController;
