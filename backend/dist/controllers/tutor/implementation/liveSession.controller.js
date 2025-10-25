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
exports.LiveSessionController = void 0;
const statusCode_1 = require('../../../constants/statusCode');
class LiveSessionController {
  constructor(service) {
    this.service = service;
    this.create = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const { topicId } = req.params;
          const tutorId = req.user.id;
          const session = yield this.service.createSession(topicId, tutorId, req.body);
          res.status(statusCode_1.HttpStatus.CREATED).json(session);
        } catch (err) {
          console.error(err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to create live session' });
        }
      });
    this.listByTopic = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const { topicId } = req.params;
          const { status } = req.query;
          const sessions = yield this.service.listByTopic(topicId, status);
          res.json(sessions);
        } catch (err) {
          console.error(err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Failed to fetch sessions' });
        }
      });
    this.getById = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const session = yield this.service.getById(req.params.id);
        if (!session) res.status(404).json({ message: 'Session not found' });
        res.json(session);
      });
    this.updateStatus = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const updated = yield this.service.updateStatus(req.params.id, req.body.status);
        if (!updated) res.status(404).json({ message: 'Session not found' });
        res.json(updated);
      });
    this.delete = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        yield this.service.delete(req.params.id);
        res.sendStatus(204);
      });
  }
}
exports.LiveSessionController = LiveSessionController;
