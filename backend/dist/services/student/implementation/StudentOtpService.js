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
Object.defineProperty(exports, '__esModule', { value: true });
exports.StudentOtpService = void 0;
const GenerateOtp_1 = require('../../../utils/GenerateOtp');
const SendEmail_1 = require('../../../utils/SendEmail');
class StudentOtpService {
  constructor(StudentOtpRepository, StudentRepository) {
    this.StudentOtpRepository = StudentOtpRepository;
    this.StudentRepository = StudentRepository;
  }
  verifyOtp(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      const existingOtp = yield this.StudentOtpRepository.findLatestByEmail(email);
      if (!existingOtp) throw new Error('No OTP found for this email');
      if (existingOtp.expiresAt < new Date()) throw new Error('OTP has expired');
      if (existingOtp.otp !== otp) throw new Error('Invalid OTP');
      yield this.StudentRepository.updateIsVerified(email);
      return 'OTP verified successfully';
    });
  }
  resendOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
      const student = yield this.StudentRepository.findByEmail(email);
      if (!student) throw new Error('Student not found');
      const otp = (0, GenerateOtp_1.generateOtp)();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      yield this.StudentOtpRepository.saveOtp(email, otp, expiresAt);
      yield (0, SendEmail_1.sendOtpEmail)(email, otp);
      return 'OTP resent successfully';
    });
  }
}
exports.StudentOtpService = StudentOtpService;
