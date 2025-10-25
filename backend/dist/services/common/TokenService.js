'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const GenerateToken_1 = require('../../utils/GenerateToken');
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
class TokenService {
  generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }
  verifyRefreshTokenAndGenerateAccess(refreshToken) {
    try {
      const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
      return (0, GenerateToken_1.generateAccessToken)(
        decoded.id,
        decoded.email,
        decoded.role,
        decoded === null || decoded === void 0 ? void 0 : decoded.name,
      );
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
exports.TokenService = TokenService;
