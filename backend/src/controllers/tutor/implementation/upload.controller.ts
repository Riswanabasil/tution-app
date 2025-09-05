import { Request, Response, NextFunction } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../../../utils/s3Client';
import { HttpStatus } from '../../../constants/statusCode';

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
      res.status(HttpStatus.OK).json({ message: 'Invalid count value' });
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
