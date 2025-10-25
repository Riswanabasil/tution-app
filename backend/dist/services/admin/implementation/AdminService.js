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
exports.AdminService = void 0;
const GenerateToken_1 = require("../../../utils/GenerateToken");
class AdminService {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                throw new Error('Invalid credentials');
            }
            const accessToken = (0, GenerateToken_1.generateAccessToken)('admin', email, 'admin');
            const refreshToken = (0, GenerateToken_1.generateRefreshToken)('admin', email, 'admin');
            return { accessToken, refreshToken };
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
        });
    }
}
exports.AdminService = AdminService;
