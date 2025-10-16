"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignPutObject = presignPutObject;
exports.presignGetObject = presignGetObject;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client_1 = require("./s3Client");
const DEFAULT_EXPIRES = Number((_a = process.env.S3_PRESIGN_EXPIRES_SECONDS) !== null && _a !== void 0 ? _a : 900);
const DEFAULT_BUCKET = process.env.S3_BUCKET_NAME;
const sanitize = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);
function presignPutObject(_a) {
    return __awaiter(this, arguments, void 0, function* ({ keyPrefix, filename, contentType, bucket = DEFAULT_BUCKET, expiresIn = DEFAULT_EXPIRES, }) {
        const safe = sanitize(filename);
        const key = `${keyPrefix}/${Date.now()}-${safe}`;
        const cmd = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
            ACL: 'private',
        });
        const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3, cmd, { expiresIn });
        return { uploadUrl, key };
    });
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
function presignGetObject(key_1) {
    return __awaiter(this, arguments, void 0, function* (key, opts = {}) {
        var _a, _b;
        if (!key || !key.trim())
            return undefined;
        if (key.startsWith('http')) {
            try {
                const u = new URL(key);
                key = decodeURIComponent(u.pathname.replace(/^\//, ''));
            }
            catch (_c) {
                return undefined;
            }
        }
        const bucket = (_a = opts.bucket) !== null && _a !== void 0 ? _a : DEFAULT_BUCKET;
        const expiresIn = (_b = opts.expiresIn) !== null && _b !== void 0 ? _b : DEFAULT_EXPIRES;
        const cmd = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3, cmd, { expiresIn });
    });
}
