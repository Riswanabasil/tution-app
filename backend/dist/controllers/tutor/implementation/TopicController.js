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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TopicController = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class TopicController {
  constructor(service) {
    this.service = service;
    this.create = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const moduleId = new mongoose_1.default.Types.ObjectId(req.params.moduleId);
          console.log(req.body);
          const { title, description, order } = req.body;
          const topic = yield this.service.create({ title, description, order, moduleId });
          res.status(statusCode_1.HttpStatus.CREATED).json(topic);
        } catch (error) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.getByModule = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const topics = yield this.service.getByModule(req.params.moduleId);
          res.json({ topics: topics });
        } catch (error) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.getById = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const topic = yield this.service.getById(req.params.id);
          if (!topic) {
            res
              .status(statusCode_1.HttpStatus.NOT_FOUND)
              .json({ message: errorMessages_1.ERROR_MESSAGES.NOT_FOUND });
            return;
          }
          res.json(topic);
        } catch (error) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.update = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const updated = yield this.service.update(req.params.id, req.body);
          res.json(updated);
        } catch (error) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
    this.delete = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          yield this.service.delete(req.params.id);
          res.status(statusCode_1.HttpStatus.NO_CONTENT).send();
        } catch (error) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
      });
  }
}
exports.TopicController = TopicController;
