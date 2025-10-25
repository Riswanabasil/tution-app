'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OtpService = void 0;
const StudentOtpSchema_1 = __importDefault(require('../../models/student/StudentOtpSchema'));
const GenerateOtp_1 = require('../../utils/GenerateOtp');
const SendEmail_1 = require('../../utils/SendEmail');
class OtpService {
  generateAndSendOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
      const otp = (0, GenerateOtp_1.generateOtp)();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      yield StudentOtpSchema_1.default.create({ email, otp, expiresAt });
      yield (0, SendEmail_1.sendOtpEmail)(email, otp);
      return otp;
    });
  }
}
exports.OtpService = OtpService;
