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
exports.StudentAssignmentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const s3Presign_1 = require("../../../utils/s3Presign");
class StudentAssignmentService {
    constructor(assignmentRepo, submissionRepo) {
        this.assignmentRepo = assignmentRepo;
        this.submissionRepo = submissionRepo;
    }
    listAssignmentsWithStatus(topicId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignments = yield this.assignmentRepo.findByTopic(topicId);
            const assignmentIds = assignments.map((a) => a._id.toString());
            const submissions = yield this.submissionRepo.findByStudentAndAssignments(studentId, assignmentIds);
            const submissionMap = new Map(submissions.map((s) => [s.assignmentId.toString(), s]));
            const now = new Date();
            const enriched = assignments.map((assignment) => {
                const submission = submissionMap.get(assignment._id.toString());
                let status;
                if (!submission) {
                    status = assignment.dueDate < now ? 'expired' : 'not submitted';
                }
                else {
                    status = submission.status;
                }
                return {
                    _id: assignment._id,
                    title: assignment.title,
                    description: assignment.description,
                    dueDate: assignment.dueDate,
                    status,
                    submission: submission
                        ? {
                            _id: submission._id,
                            submittedFiles: submission.submittedFile,
                            feedback: submission.feedback,
                            submittedAt: submission.createdAt,
                        }
                        : null,
                };
            });
            return enriched;
        });
    }
    createSubmissionService(data, studentId, assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { topicId, response, fileKey } = data;
            const assgn = new mongoose_1.default.Types.ObjectId(assignmentId);
            const assignment = yield this.assignmentRepo.findById(assgn);
            if (!assignment)
                throw new Error('Assignment not found');
            const courseId = assignment.courseId;
            // const submittedFile = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(FileKey)}`;
            const toSave = {
                studentId,
                topicId,
                courseId,
                assignmentId,
                response,
                submittedFile: fileKey,
                status: 'pending',
            };
            const created = yield this.submissionRepo.create(toSave);
            const url = yield (0, s3Presign_1.presignGetObject)(fileKey);
            const obj = created.toObject ? created.toObject() : created;
            return Object.assign(Object.assign({}, obj), { submittedFile: url });
            // return await this.submissionRepo.create(toSave);
        });
    }
    getSubmission(assignmentId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield this.submissionRepo.findByAssignmentAndStudent(assignmentId, studentId);
            if (!submission)
                throw new Error('Submission not found');
            // return submission;
            const url = yield (0, s3Presign_1.presignGetObject)(submission.submittedFile);
            // return same shape the FE expects, but with URL
            const obj = submission.toObject ? submission.toObject() : submission;
            return Object.assign(Object.assign({}, obj), { submittedFile: url !== null && url !== void 0 ? url : '' });
        });
    }
    updateSubmissionByAssignment(assignmentId, studentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { response, fileKey } = data;
            const existing = yield this.submissionRepo.findByAssignmentAndStudent(assignmentId, studentId);
            if (!existing) {
                throw new Error('Submission not found for this assignment and student');
            }
            const submittedFile = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(fileKey)}`;
            return yield this.submissionRepo.updateSubmissionByAssignmentAndStudent(assignmentId, studentId, response, submittedFile);
        });
    }
}
exports.StudentAssignmentService = StudentAssignmentService;
