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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoteUploadUrls = getNoteUploadUrls;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client_1 = require("../../../utils/s3Client");
const statusCode_1 = require("../../../constants/statusCode");
function getNoteUploadUrls(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { count } = req.body;
            if (!count || count <= 0) {
                res.status(statusCode_1.HttpStatus.OK).json({ message: 'Invalid count value' });
                return;
            }
            const prefix = 'note';
            const uploadData = yield Promise.all(Array.from({ length: count }).map((_, i) => __awaiter(this, void 0, void 0, function* () {
                const filename = `${prefix}-${Date.now()}-${i}.pdf`;
                const key = `notes/${filename}`;
                const cmd = new client_s3_1.PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: key,
                    ContentType: 'application/pdf',
                    ACL: 'private',
                });
                const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3, cmd, { expiresIn: 900 });
                return { uploadUrl, key };
            })));
            res.json(uploadData);
        }
        catch (err) {
            next(err);
        }
    });
}
