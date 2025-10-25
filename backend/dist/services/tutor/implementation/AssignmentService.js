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
exports.AssignmentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class AssignmentService {
    constructor(assignmentRepo, topicRepo, moduleRepo, courseRepo) {
        this.assignmentRepo = assignmentRepo;
        this.topicRepo = topicRepo;
        this.moduleRepo = moduleRepo;
        this.courseRepo = courseRepo;
    }
    createAssignment(topicId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = yield this.topicRepo.findById(topicId);
            if (!topic)
                throw new Error('Topic not found');
            const moduleId = new mongoose_1.default.Types.ObjectId(topic.moduleId);
            const module = yield this.moduleRepo.findById(moduleId);
            const courseId = module === null || module === void 0 ? void 0 : module.courseId;
            const course = yield this.courseRepo.findById(courseId);
            const assignmentData = Object.assign(Object.assign({}, data), { topicId,
                courseId, createdBy: course === null || course === void 0 ? void 0 : course.tutor });
            return this.assignmentRepo.create(assignmentData);
        });
    }
    getAssignmentsByTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentRepo.findByTopic(topicId);
        });
    }
    getAssignmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentRepo.findById(id);
        });
    }
    updateAssignment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentRepo.update(id, data);
        });
    }
    deleteAssignment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.assignmentRepo.softDelete(id);
        });
    }
}
exports.AssignmentService = AssignmentService;
