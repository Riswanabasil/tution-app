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
exports.StudentAdminController = void 0;
const statusCode_1 = require("../../constants/statusCode");
const errorMessages_1 = require("../../constants/errorMessages");
class StudentAdminController {
    constructor(studentService) {
        this.studentService = studentService;
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || '';
                const sort = req.query.sort || 'createdAt';
                const order = req.query.order === 'asc' ? 1 : -1;
                const result = yield this.studentService.getAllStudents(page, limit, search, sort, order);
                res.status(200).json(result);
            }
            catch (error) {
                res
                    .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            }
        });
    }
    blockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { isBlocked } = req.body;
                yield this.studentService.blockStudent(id, isBlocked);
                res
                    .status(statusCode_1.HttpStatus.OK)
                    .json({ message: `Student has been ${isBlocked ? 'blocked' : 'unblocked'}` });
            }
            catch (error) {
                res.status(statusCode_1.HttpStatus.BAD_REQUEST).json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
            }
        });
    }
}
exports.StudentAdminController = StudentAdminController;
