import { Request, Response, NextFunction } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../../../utils/s3Client';

export async function getUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, contentType } = req.query as {
      filename: string;
      contentType: string;
    };
    const key = `courses/${Date.now()}-${filename}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      ACL: 'private',
    });
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 });

    res.json({ uploadUrl, key });
  } catch (err) {
    next(err);
  }
}

export async function getDemoUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, contentType } = req.query as {
      filename: string;
      contentType: string;
    };
    const key = `videos/${Date.now()}-${filename}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      ACL: 'private',
    });
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 });

    res.json({ uploadUrl, key });
  } catch (err) {
    next(err);
  }
}

export async function getProfileUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, contentType } = req.query as {
      filename: string;
      contentType: string;
    };
    const key = `TutorPic/${Date.now()}-${filename}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      ACL: 'private',
    });
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 });

    res.json({ uploadUrl, key });
  } catch (err) {
    next(err);
  }
}

export async function getNoteUploadUrls(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { count } = req.body as {
      count: number;
    };

    if (!count || count <= 0) {
      res.status(400).json({ message: 'Invalid count value' });
      return;
    }

    const prefix = 'note';

    const uploadData = await Promise.all(
      Array.from({ length: count }).map(async (_, i) => {
        const filename = `${prefix}-${Date.now()}-${i}.pdf`;
        const key = `notes/${filename}`;

        const cmd = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          ContentType: 'application/pdf',
          ACL: 'private',
        });

        const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 });
        return { uploadUrl, key };
      }),
    );

    res.json(uploadData);
  } catch (err) {
    next(err);
  }
}
