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
exports.VideoController = void 0;
const client_s3_1 = require('@aws-sdk/client-s3');
const statusCode_1 = require('../../../constants/statusCode');
const s3Presign_1 = require('../../../utils/s3Presign');
class VideoController {
  constructor(service) {
    this.service = service;
    this.s3 = new client_s3_1.S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  // async getVideoUploadUrl(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  //   try {
  //     const tutorId = req.user!.id;
  //     const { filename, contentType } = req.query as { filename: string; contentType: string };
  //     const key = `Tutor-videos/${tutorId}/${Date.now()}-${filename}`;
  //     const cmd = new PutObjectCommand({
  //       Bucket: process.env.S3_BUCKET_NAME!,
  //       Key: key,
  //       ContentType: contentType,
  //       ACL: 'private',
  //     });
  //     const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 900 });
  //     res.json({ uploadUrl, key });
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  getVideoUploadUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'Tutor-videos',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  // async createVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  //   try {
  //     const tutorId = req.user!.id;
  //     const { topicId, title, description, durationSec, key, contentType } = req.body;
  //     const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`;
  //     const video = await this.service.create({
  //       tutorId,
  //       topicId,
  //       title,
  //       description,
  //       durationSec: Number(durationSec),
  //       key,
  //       contentType,
  //       url,
  //     });
  //     res.status(HttpStatus.CREATED).json(video);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  createVideo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const tutorId = req.user.id;
        const { topicId, title, description, durationSec, key, contentType } = req.body;
        const video = yield this.service.create({
          tutorId,
          topicId,
          title,
          description,
          durationSec: Number(durationSec),
          key,
          contentType,
        });
        const signed = yield (0, s3Presign_1.presignGetObject)(key);
        const obj = video.toObject ? video.toObject() : video;
        res
          .status(statusCode_1.HttpStatus.CREATED)
          .json(Object.assign(Object.assign({}, obj), { url: signed }));
      } catch (err) {
        next(err);
      }
    });
  }
  listByTopic(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { topicId } = req.params;
        const videos = yield this.service.listByTopic(topicId);
        res.json(videos);
      } catch (err) {
        next(err);
      }
    });
  }
  update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const updated = yield this.service.update(id, req.body);
        res.json(updated);
      } catch (err) {
        next(err);
      }
    });
  }
  remove(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        yield this.service.softDelete(id);
        res.status(statusCode_1.HttpStatus.NO_CONTENT).end();
      } catch (err) {
        next(err);
      }
    });
  }
}
exports.VideoController = VideoController;
