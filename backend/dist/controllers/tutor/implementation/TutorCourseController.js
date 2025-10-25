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
exports.TutorCourseController = void 0;
const s3Presign_1 = require('../../../utils/s3Presign');
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class TutorCourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }
  getUploadUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'courses',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  getDemoUploadUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'videos',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  createCourse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const tutorId = req.user.id;
        const imageKey = req.body.imageKey;
        const demoKey = req.body.demoKey;
        const thumbnailUrl = imageKey
          ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
            encodeURIComponent(imageKey)
          : undefined;
        const demoVideoUrl = demoKey
          ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
            encodeURIComponent(demoKey)
          : undefined;
        const data = Object.assign(Object.assign({}, req.body), {
          tutor: tutorId,
          // thumbnail: thumbnailUrl,
          // demoVideoUrl: demoVideoUrl,
          thumbnailKey: imageKey,
          demoKey: demoKey,
        });
        console.log(data);
        const course = yield this.courseService.createCourse(data);
        console.log(course);
        res.status(statusCode_1.HttpStatus.CREATED).json(course);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  getAllCourses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const tutorId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const result = yield this.courseService.getAllCourses(tutorId, page, limit, search);
        res.status(statusCode_1.HttpStatus.OK).json(result);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  getCourseById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const course = yield this.courseService.getCourseById(req.params.id);
        if (!course) {
          res.status(statusCode_1.HttpStatus.NOT_FOUND).json({ message: 'Course not found' });
          return;
        }
        res.status(statusCode_1.HttpStatus.OK).json(course);
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  // async updateCourse(req: Request, res: Response): Promise<void> {
  //   try {
  //     const thumbnail = (req.file as Express.Multer.File)?.filename;
  //     const data = { ...req.body, ...(thumbnail && { thumbnail }) };
  //     const updated = await this.courseService.updateCourse(req.params.id, data);
  //     if (!updated) {
  //       res.status(HttpStatus.NOT_FOUND).json({ message: 'Course not found' });
  //       return;
  //     }
  //     res.status(HttpStatus.OK).json(updated);
  //   } catch (err) {
  //     res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
  //   }
  // }
  reapplyCourse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const courseId = req.params.id;
        const tutorId = req.user.id;
        const updated = yield this.courseService.reapply(courseId, tutorId);
        res.status(statusCode_1.HttpStatus.OK).json(updated);
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  softDeleteCourse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { id } = req.params;
      yield this.courseService.softDeleteCourse(id);
      res.status(statusCode_1.HttpStatus.NO_CONTENT).end();
    });
  }
}
exports.TutorCourseController = TutorCourseController;
