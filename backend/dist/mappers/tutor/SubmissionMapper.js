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
exports.SubmissionMapper = void 0;
const s3Presign_1 = require('../../utils/s3Presign');
class SubmissionMapper {
  static toResponse(submission) {
    return __awaiter(this, void 0, void 0, function* () {
      const obj = (submission === null || submission === void 0 ? void 0 : submission.toObject)
        ? submission.toObject()
        : submission;
      const url = yield (0, s3Presign_1.presignGetObject)(
        obj === null || obj === void 0 ? void 0 : obj.submittedFile,
      );
      return Object.assign(Object.assign({}, obj), {
        submittedFile: url !== null && url !== void 0 ? url : '',
      });
    });
  }
}
exports.SubmissionMapper = SubmissionMapper;
