'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AssignmentController = void 0;
const s3Presign_1 = require('../../../utils/s3Presign');
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class AssignmentController {
  constructor(assgnService) {
    this.assgnService = assgnService;
  }
  getAssignmentsForStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const studentId = req.user.id;
        const topicId = req.params.topicId;
        const data = yield this.assgnService.listAssignmentsWithStatus(topicId, studentId);
        res.status(statusCode_1.HttpStatus.OK).json(data);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  generatePresignedUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      try {
        const q = req.query;
        const filename = (
          (_b = (_a = q.filename) !== null && _a !== void 0 ? _a : q.fileName) !== null &&
          _b !== void 0
            ? _b
            : ''
        )
          .toString()
          .trim();
        const contentType = ((_c = q.contentType) !== null && _c !== void 0 ? _c : '')
          .toString()
          .trim();
        if (!filename || !contentType) {
          res.status(400).json({ message: 'fileName and contentType are required' });
        }
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'submission',
          filename: decodeURIComponent(filename),
          contentType: decodeURIComponent(contentType),
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  createSubmissionController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const assignmentId = req.params.assignmentId;
        const studentId = req.user.id;
        const data = req.body;
        const submission = yield this.assgnService.createSubmissionService(
          data,
          studentId,
          assignmentId,
        );
        res.status(201).json({ message: 'Submission created successfully', submission });
      } catch (error) {
        console.log(error);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  getStudentSubmissionByAssignment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { assignmentId } = req.params;
        const studentId = req.user.id;
        const submission = yield this.assgnService.getSubmission(assignmentId, studentId);
        res.status(statusCode_1.HttpStatus.OK).json(submission);
      } catch (err) {
        res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ error: 'Submission not found' });
      }
    });
  }
  updateSubmissionByAssignment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { assignmentId } = req.params;
      try {
        const studentId = req.user.id;
        const { response, fileKey } = req.body;
        const updated = yield this.assgnService.updateSubmissionByAssignment(
          assignmentId,
          studentId,
          { response, fileKey },
        );
        res.status(statusCode_1.HttpStatus.OK).json(updated);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ error: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
}
exports.AssignmentController = AssignmentController;
