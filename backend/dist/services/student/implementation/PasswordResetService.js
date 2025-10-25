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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordResetService {
    constructor(otpRepo, studentRepo, otpSvc) {
        this.otpRepo = otpRepo;
        this.studentRepo = studentRepo;
        this.otpSvc = otpSvc;
    }
    requestReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.studentRepo.findByEmail(email);
            if (user)
                yield this.otpSvc.generateAndSendOtp(email);
        });
    }
    verifyResetOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const latest = yield this.otpRepo.findLatestByEmail(email);
            if (!latest)
                throw new Error('Invalid OTP');
            if (latest.expiresAt < new Date())
                throw new Error('OTP expired');
            if (latest.otp !== otp)
                throw new Error('Invalid OTP');
        });
    }
    resetWithOtp(email, newPassword, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newPassword || newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            const user = yield this.studentRepo.findByEmail(email);
            if (!user)
                throw new Error('Account not found');
            const hash = yield bcrypt_1.default.hash(newPassword, 10);
            yield this.studentRepo.updatePasswordByEmail(email, hash);
        });
    }
}
exports.PasswordResetService = PasswordResetService;
