import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../types/Index';
import type { IVideoController } from '../IVideoController';
import type { IVideoService } from '../../../services/tutor/IVideoService';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpStatus } from '../../../constants/statusCode';
import { presignGetObject, presignPutObject } from '../../../utils/s3Presign';

export class VideoController implements IVideoController {
  private s3: S3Client;

  constructor(private service: IVideoService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
  async getVideoUploadUrl(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { filename, contentType } = req.query as { filename: string; contentType: string };
      const data = await presignPutObject({ keyPrefix: 'Tutor-videos', filename, contentType });
      res.json(data);
    } catch (err) {
      next(err);
    }
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

  async createVideo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tutorId = req.user!.id;
      const { topicId, title, description, durationSec, key, contentType } = req.body;

      const video = await this.service.create({
        tutorId,
        topicId,
        title,
        description,
        durationSec: Number(durationSec),
        key,
        contentType,
      });

      const signed = await presignGetObject(key);
      const obj = (video as any).toObject ? (video as any).toObject() : video;

      res.status(HttpStatus.CREATED).json({ ...obj, url: signed });
    } catch (err) {
      next(err);
    }
  }
  async listByTopic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { topicId } = req.params;
      const videos = await this.service.listByTopic(topicId);
      res.json(videos);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await this.service.update(id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.service.softDelete(id);
      res.status(HttpStatus.NO_CONTENT).end();
    } catch (err) {
      next(err);
    }
  }
}
