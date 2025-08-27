import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './s3Client';

const DEFAULT_EXPIRES = Number(process.env.S3_PRESIGN_EXPIRES_SECONDS ?? 900);
const DEFAULT_BUCKET = process.env.S3_BUCKET_NAME!;

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);

export async function presignPutObject({
  keyPrefix,
  filename,
  contentType,
  bucket = DEFAULT_BUCKET,
  expiresIn = DEFAULT_EXPIRES,
}: {
  keyPrefix: string;
  filename: string;
  contentType: string;
  bucket?: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; key: string }> {
  const safe = sanitize(filename);
  const key = `${keyPrefix}/${Date.now()}-${safe}`;

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ACL: 'private',
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn });
  return { uploadUrl, key };
}
