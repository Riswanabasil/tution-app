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
exports.AdminController = void 0;
const statusCode_1 = require('../../constants/statusCode');
const errorMessages_1 = require('../../constants/errorMessages');
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }
  loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, password } = req.body;
        const result = yield this.adminService.loginAdmin(email, password);
        const REFRESH_COOKIE = Number(process.env.MAX_AGE);
        console.log(typeof REFRESH_COOKIE);
        res.cookie('adminRefreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Admin login successful',
          accessToken: result.accessToken,
        });
      } catch (error) {
        console.error(error);
        res.status(statusCode_1.HttpStatus.UNAUTHORIZED).json({ message: 'Login failed' });
      }
    });
  }
  logoutAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      res.clearCookie('adminRefreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(statusCode_1.HttpStatus.OK).json({ message: 'Admin logged out successfully' });
    });
  }
  refreshAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const refreshToken = req.cookies.adminRefreshToken;
        if (!refreshToken) {
          res
            .status(statusCode_1.HttpStatus.UNAUTHORIZED)
            .json({ message: errorMessages_1.ERROR_MESSAGES.UNAUTHORIZED });
          return;
        }
        const newAccessToken = yield this.adminService.refreshAccessToken(refreshToken);
        res.status(statusCode_1.HttpStatus.OK).json({ accessToken: newAccessToken });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.FORBIDDEN)
          .json({ message: errorMessages_1.ERROR_MESSAGES.FORBIDDEN });
      }
    });
  }
}
exports.AdminController = AdminController;
