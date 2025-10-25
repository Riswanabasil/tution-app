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
exports.PasswordResetController = void 0;
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class PasswordResetController {
  constructor(svc) {
    this.svc = svc;
  }
  forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email } = req.body;
      yield this.svc.requestReset(email);
      res
        .status(statusCode_1.HttpStatus.OK)
        .json({ message: 'If that email exists, an OTP has been sent.' });
    });
  }
  verifyResetOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, otp } = req.body;
      try {
        yield this.svc.verifyResetOtp(email, otp);
        res
          .status(statusCode_1.HttpStatus.OK)
          .json({ message: 'OTP verified. You can reset your password now.' });
      } catch (e) {
        res.status(statusCode_1.HttpStatus.BAD_REQUEST).json({ message: 'Invalid OTP' });
      }
    });
  }
  resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, newPassword, confirmPassword } = req.body;
      try {
        yield this.svc.resetWithOtp(email, newPassword, confirmPassword);
        res.status(statusCode_1.HttpStatus.OK).json({ message: 'Password updated successfully' });
      } catch (e) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
}
exports.PasswordResetController = PasswordResetController;
