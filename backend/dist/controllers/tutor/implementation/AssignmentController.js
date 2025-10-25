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
exports.AssignmentController = void 0;
const statusCode_1 = require("../../../constants/statusCode");
class AssignmentController {
    constructor(assignmentService) {
        this.assignmentService = assignmentService;
        this.createAssignment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { topicId } = req.params;
                const assignment = yield this.assignmentService.createAssignment(topicId, req.body);
                res.status(statusCode_1.HttpStatus.CREATED).json(assignment);
            }
            catch (error) {
                console.error(error);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create assignment' });
            }
        });
        this.getAssignmentsByTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { topicId } = req.params;
                const { page = 1, limit = 10, search = '', } = req.query;
                const allAssignments = yield this.assignmentService.getAssignmentsByTopic(topicId);
                const filtered = allAssignments.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
                const startIndex = (Number(page) - 1) * Number(limit);
                const paginated = filtered.slice(startIndex, startIndex + Number(limit));
                res.status(statusCode_1.HttpStatus.OK).json({
                    total: filtered.length,
                    page: Number(page),
                    limit: Number(limit),
                    data: paginated,
                });
            }
            catch (error) {
                console.error(error);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch assignments' });
            }
        });
        this.getAssignmentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const assignment = yield this.assignmentService.getAssignmentById(id);
                if (!assignment) {
                    res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Assignment not found' });
                    return;
                }
                res.status(statusCode_1.HttpStatus.OK).json(assignment);
            }
            catch (error) {
                console.error(error);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch assignment' });
            }
        });
        this.updateAssignment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updated = yield this.assignmentService.updateAssignment(id, req.body);
                if (!updated) {
                    res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Assignment not found' });
                    return;
                }
                res.status(statusCode_1.HttpStatus.OK).json({ message: 'Assignment updated successfully', updated });
            }
            catch (error) {
                console.error(error);
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update assignment' });
            }
        });
        this.deleteAssignment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.assignmentService.deleteAssignment(id);
                res.status(statusCode_1.HttpStatus.OK).json({ message: 'Assignment deleted (soft)' });
            }
            catch (error) {
                res.status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete assignment' });
            }
        });
    }
}
exports.AssignmentController = AssignmentController;
