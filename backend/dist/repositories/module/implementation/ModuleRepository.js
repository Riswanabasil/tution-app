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
exports.ModuleRepository = void 0;
const ModuleSchema_1 = require('../../../models/module/ModuleSchema');
const BaseRepository_1 = require('../../base/BaseRepository');
class ModuleRepository extends BaseRepository_1.BaseRepository {
  constructor() {
    super(ModuleSchema_1.Module);
  }
  findByCourse(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
      return ModuleSchema_1.Module.find({
        courseId,
        deletedAt: { $exists: false },
      })
        .sort({ order: 1 })
        .exec();
    });
  }
  findByModule(courseId, moduleId) {
    return __awaiter(this, void 0, void 0, function* () {
      return ModuleSchema_1.Module.findOne({ _id: moduleId, courseId }).exec();
    });
  }
  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return ModuleSchema_1.Module.create(data);
    });
  }
  update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
      return ModuleSchema_1.Module.findByIdAndUpdate(id, data, { new: true }).exec();
    });
  }
  softDelete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      yield ModuleSchema_1.Module.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
    });
  }
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return ModuleSchema_1.Module.findById(id).exec();
    });
  }
}
exports.ModuleRepository = ModuleRepository;
