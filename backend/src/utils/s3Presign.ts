import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
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
// export async function presignGetObject({
//   key,
//   bucket = DEFAULT_BUCKET,
//   expiresIn = DEFAULT_EXPIRES,
//   downloadName, 
// }: {
//   key: string;
//   bucket?: string;
//   expiresIn?: number;
//   downloadName?: string;
// }): Promise<string> {
//   const cmd = new GetObjectCommand({
//     Bucket: bucket,
//     Key: key,
//     ResponseContentDisposition: downloadName
//       ? `attachment; filename="${downloadName}"`
//       : 'inline',
//   });
//   return getSignedUrl(s3, cmd, { expiresIn });
// }

export async function presignGetObject(
  key?: string,
  opts: { bucket?: string; expiresIn?: number } = {}
): Promise<string | undefined> {
  if (!key || !key.trim()) return undefined;
  if (key.startsWith('http')) {
    try {
      const u = new URL(key);
      key = decodeURIComponent(u.pathname.replace(/^\//, ''));
    } catch { return undefined; }
  }

  const bucket = opts.bucket ?? DEFAULT_BUCKET;
  const expiresIn = opts.expiresIn ?? DEFAULT_EXPIRES;

  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn });
}