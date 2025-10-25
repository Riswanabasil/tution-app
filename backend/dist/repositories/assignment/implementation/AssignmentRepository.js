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
exports.AssignmentRepository = void 0;
const AssignmentModel_1 = require('../../../models/assignment/AssignmentModel');
class AssignmentRepository {
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield AssignmentModel_1.AssignmentModel.create(data);
    });
  }
  findByTopic(topicId) {
    return __awaiter(this, void 0, void 0, function* () {
      return AssignmentModel_1.AssignmentModel.find({ topicId, isDeleted: false })
        .sort({ createdAt: -1 })
        .exec();
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return AssignmentModel_1.AssignmentModel.findOne({ _id: id, isDeleted: false }).exec();
    });
  }
  update(id, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
      return AssignmentModel_1.AssignmentModel.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
    });
  }
  softDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield AssignmentModel_1.AssignmentModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
    });
  }
}
exports.AssignmentRepository = AssignmentRepository;
