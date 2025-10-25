'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.uploadTutorDocs = void 0;
const multer_1 = __importDefault(require('multer'));
const storage = multer_1.default.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/tutorDocs'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
exports.uploadTutorDocs = upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);
