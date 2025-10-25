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
exports.NoteController = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const s3Presign_1 = require('../../../utils/s3Presign');
const statusCode_1 = require('../../../constants/statusCode');
class NoteController {
  constructor(service) {
    this.service = service;
    this.create = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const topicId = new mongoose_1.default.Types.ObjectId(req.params.topicId);
          const { pdfKeys } = req.body;
          const firstKey = pdfKeys === null || pdfKeys === void 0 ? void 0 : pdfKeys[0];
          if (!firstKey)
            res
              .status(statusCode_1.HttpStatus.BAD_REQUEST)
              .json({ message: 'pdfKeys[0] required' });
          const note = yield this.service.create({ topicId, pdfKey: firstKey });
          const url = yield (0, s3Presign_1.presignGetObject)(firstKey);
          const obj = note.toObject ? note.toObject() : note;
          res
            .status(statusCode_1.HttpStatus.CREATED)
            .json(Object.assign(Object.assign({}, obj), { pdfUrls: url ? [url] : [] }));
        } catch (e) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
        }
      });
    this.getByTopic = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const notes = yield this.service.getByTopic(req.params.topicId);
          res.json(notes);
        } catch (e) {
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    this.getById = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const note = yield this.service.getById(req.params.id);
          if (!note) {
            res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Note not found' });
            return;
          }
          res.json(note);
        } catch (err) {
          console.error('Get Note by ID Error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
        }
      });
    this.update = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const { pdfKeys } = req.body;
          const firstKey = pdfKeys === null || pdfKeys === void 0 ? void 0 : pdfKeys[0];
          if (!firstKey)
            res
              .status(statusCode_1.HttpStatus.BAD_REQUEST)
              .json({ message: 'pdfKeys[0] required' });
          const updated = yield this.service.update(req.params.noteId, {
            pdfKey: firstKey,
            uploadedAt: new Date(),
          });
          const url = yield (0, s3Presign_1.presignGetObject)(firstKey);
          res.json(Object.assign(Object.assign({}, updated), { pdfUrls: url ? [url] : [] }));
        } catch (e) {
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
        }
      });
    this.delete = (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          yield this.service.delete(req.params.id);
          res.status(statusCode_1.HttpStatus.NO_CONTENT).send();
        } catch (err) {
          console.error('Delete Note Error:', err);
          res
            .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
        }
      });
  }
  getNoteUploadUrls(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'notes',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
}
exports.NoteController = NoteController;
