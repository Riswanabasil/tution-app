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
exports.StudentController = void 0;
const s3Presign_1 = require('../../../utils/s3Presign');
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class StudentController {
  constructor(studentService, otpService, commonOtp) {
    this.studentService = studentService;
    this.otpService = otpService;
    this.commonOtp = commonOtp;
  }
  registerStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, email, phone, password } = req.body;
        const { student, token } = yield this.studentService.registerStudentService(
          name,
          email,
          phone,
          password,
        );
        res.status(statusCode_1.HttpStatus.CREATED).json({
          message: 'Student registered successfully',
          student: {
            id: student._id,
            name: student.name,
            phone: student.phone,
            email: student.email,
            role: student.role,
          },
          token,
        });
      } catch (error) {
        console.error('Register Error:', error);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  verifyStudentOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!email) throw new Error('Unauthorized');
        const { otp } = req.body;
        const result = yield this.otpService.verifyOtp(email, otp);
        res.status(statusCode_1.HttpStatus.OK).json({ message: result });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  resendOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!email) throw new Error('Unauthorized');
        const result = yield this.otpService.resendOtp(email);
        res.status(statusCode_1.HttpStatus.OK).json({ message: result });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  loginStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, student } =
          yield this.studentService.loginStudentService(email, password);
          const REFRESH_COOKIE=parseInt(MAX_AGE)
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: REFRESH_COOKIE,
        });
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Login successful',
          accessToken,
          student,
        });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.UNAUTHORIZED)
          .json({ message: errorMessages_1.ERROR_MESSAGES.UNAUTHORIZED });
      }
    });
  }
  logoutStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(statusCode_1.HttpStatus.OK).json({ message: 'Student logged out successfully' });
    });
  }
  refreshAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          res
            .status(statusCode_1.HttpStatus.UNAUTHORIZED)
            .json({ message: 'No refresh token provided' });
          return;
        }
        const newAccessToken = yield this.studentService.refreshAccessToken(refreshToken);
        res.status(statusCode_1.HttpStatus.OK).json({ accessToken: newAccessToken });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.FORBIDDEN)
          .json({ message: errorMessages_1.ERROR_MESSAGES.FORBIDDEN });
      }
    });
  }
  googleLoginStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { idToken } = req.body;
        if (!idToken) {
          res
            .status(statusCode_1.HttpStatus.BAD_REQUEST)
            .json({ message: 'Google ID token missing' });
          return;
        }
        const REFRESH_COOKIE = parseInt(process.env.MAX_AGE);
        const { accessToken, refreshToken, student } =
          yield this.studentService.googleLoginStudentService(idToken);
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: REFRESH_COOKIE,
        });
        res.status(200).json({
          message: 'Google login successful',
          accessToken,
          student,
        });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.UNAUTHORIZED)
          .json({ message: errorMessages_1.ERROR_MESSAGES.UNAUTHORIZED });
      }
    });
  }
  getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = req.user.id;
        const data = yield this.studentService.getProfile(userId);
        res.json({ data });
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  getUploadUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'studentPic',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = req.user.id;
        const data = yield this.studentService.updateProfile(userId, req.body);
        res.json({ data });
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        yield this.studentService.changePassword(userId, currentPassword, newPassword);
        res.json({ message: 'Password updated' });
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
}
exports.StudentController = StudentController;
