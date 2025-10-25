"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.SubmissionRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SubmissionSchema_1 = require("../../../models/submission/SubmissionSchema");
class SubmissionRepository {
    findByStudentAndAssignments(studentId, assignmentIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return SubmissionSchema_1.SubmissionModel.find({
                studentId,
                assignmentId: { $in: assignmentIds },
                isDeleted: false,
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = new SubmissionSchema_1.SubmissionModel(data);
            return yield submission.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return SubmissionSchema_1.SubmissionModel.findById(id);
        });
    }
    findByAssignmentAndStudent(assignmentId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubmissionSchema_1.SubmissionModel.findOne({
                assignmentId,
                studentId,
                isDeleted: false,
            });
        });
    }
    updateSubmissionByAssignmentAndStudent(assignmentId, studentId, response, submittedFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubmissionSchema_1.SubmissionModel.findOneAndUpdate({
                assignmentId: new mongoose_1.default.Types.ObjectId(assignmentId),
                studentId: new mongoose_1.default.Types.ObjectId(studentId),
            }, {
                response,
                submittedFile,
                status: 'pending',
            }, { new: true });
        });
    }
    updateFeedbackAndVerify(submissionId, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            return SubmissionSchema_1.SubmissionModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(submissionId), { feedback, status: 'verified', updatedAt: new Date() }, { new: true });
        });
    }
}
exports.SubmissionRepository = SubmissionRepository;
