import { Request, Response, NextFunction } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../utils/s3Client";

export async function getUploadUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      ACL: "private",
    });
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 });

    res.json({ uploadUrl, key });
  } catch (err) {
    next(err);
  }
}
