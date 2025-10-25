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
exports.ModuleController = void 0;
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class ModuleController {
  constructor(service) {
    this.service = service;
  }
  list(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { courseId } = req.params;
        const modules = yield this.service.listByCourse(courseId);
        res.json(modules);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { courseId } = req.params;
        const { name, order } = req.body;
        const mod = yield this.service.createModule(courseId, name, order);
        res.status(statusCode_1.HttpStatus.CREATED).json(mod);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const mod = yield this.service.updateModule(id, req.body);
        if (!mod) {
          res.status(statusCode_1.HttpStatus.NOT_FOUND).end();
          return;
        }
        res.json(mod);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  delete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        yield this.service.deleteModule(id);
        res.status(statusCode_1.HttpStatus.NO_CONTENT).end();
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { courseId, id } = req.params;
        console.log('courseId', courseId);
        console.log('moduleId', id);
        const mod = yield this.service.getById(courseId, id);
        if (!mod) {
          res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Module not found' });
          return;
        }
        res.json(mod);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
}
exports.ModuleController = ModuleController;
