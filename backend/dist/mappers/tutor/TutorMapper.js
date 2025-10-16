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
exports.TutorMapper = void 0;
const s3Presign_1 = require("../../utils/s3Presign");
class TutorMapper {
    static toResponse(tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = (tutor === null || tutor === void 0 ? void 0 : tutor.toObject) ? tutor.toObject() : tutor;
            const profileUrl = yield (0, s3Presign_1.presignGetObject)(obj === null || obj === void 0 ? void 0 : obj.profilePicKey);
            return Object.assign(Object.assign({}, obj), { profilePic: profileUrl !== null && profileUrl !== void 0 ? profileUrl : '' });
        });
    }
}
exports.TutorMapper = TutorMapper;
