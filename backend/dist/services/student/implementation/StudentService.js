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
exports.StudentService = void 0;
const google_auth_library_1 = require('google-auth-library');
const GenerateToken_1 = require('../../../utils/GenerateToken');
const bcrypt_1 = __importDefault(require('bcrypt'));
class StudentService {
  constructor(studentRepo, hasher, otpService, tokenService, enrollRepo) {
    this.studentRepo = studentRepo;
    this.hasher = hasher;
    this.otpService = otpService;
    this.tokenService = tokenService;
    this.enrollRepo = enrollRepo;
  }
  registerStudentService(name, email, phone, password) {
    return __awaiter(this, void 0, void 0, function* () {
      const existing = yield this.studentRepo.findByEmail(email);
      if (existing) {
        throw new Error('Student already exists');
      }
      const hashedPassword = yield this.hasher.hash(password);
      const newStudent = yield this.studentRepo.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });
      yield this.otpService.generateAndSendOtp(email);
      const token = this.tokenService.generateToken({
        id: newStudent._id,
        email: newStudent.email,
        role: newStudent.role,
      });
      return { student: newStudent, token };
    });
  }
  loginStudentService(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      const student = yield this.studentRepo.findByEmail(email);
      if (!student) {
        throw new Error('Student not found');
      }
      if (!student.isVerified) {
        throw new Error('Please verify your email before logging in');
      }
      if (student.isBlocked) {
        throw new Error('Your account blocked');
      }
      const isMatch = yield this.hasher.compare(password, student.password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }
      const accessToken = (0, GenerateToken_1.generateAccessToken)(
        student._id.toString(),
        student.email,
        student.role,
        student.name,
      );
      const refreshToken = (0, GenerateToken_1.generateRefreshToken)(
        student._id.toString(),
        student.email,
        student.role,
      );
      return {
        accessToken,
        refreshToken,
        student: {
          id: student._id,
          email: student.email,
          name: student.name,
        },
      };
    });
  }
  refreshAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
    });
  }
  googleLoginStudentService(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
      const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = yield client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        throw new Error('Invalid Google token');
      }
      const { email, name } = payload;
      let student = yield this.studentRepo.findByEmail(email);
      if (!student) {
        student = yield this.studentRepo.create({
          name,
          email,
          password: '',
          phone: '',
          isGoogleSignup: true,
          isVerified: true,
          role: 'student',
        });
      }
      const accessToken = (0, GenerateToken_1.generateAccessToken)(
        student._id.toString(),
        student.email,
        student.role,
      );
      const refreshToken = (0, GenerateToken_1.generateRefreshToken)(
        student._id.toString(),
        student.email,
        student.role,
      );
      return {
        accessToken,
        refreshToken,
        student: {
          id: student._id,
          email: student.email,
          name: student.name,
        },
      };
    });
  }
  getProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      const student = yield this.studentRepo.findById(userId);
      if (!student) throw new Error('Student not found');
      return student;
    });
  }
  /** Update phone or profilePic */
  // async updateProfile(
  //   userId: string,
  //   updates: Partial<{ phone: string; profilePic: string }>
  // ) {
  //   const updated = await this.studentRepo.updateById(userId, updates);
  //   if (!updated) throw new Error("Failed to update profile");
  //   return updated;
  // }
  /** Verify currentPassword, then change to newPassword */
  changePassword(userId, currentPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      const student = yield this.studentRepo.findById(userId);
      if (!student) throw new Error('Student not found');
      const match = yield bcrypt_1.default.compare(currentPassword, student.password);
      if (!match) throw new Error('Current password is incorrect');
      const hash = yield bcrypt_1.default.hash(newPassword, 10);
      yield this.studentRepo.changePassword(userId, hash);
    });
  }
  updateProfile(userId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
      let finalPic;
      if (updates.profilePicKey) {
        finalPic =
          `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/` +
          encodeURIComponent(updates.profilePicKey);
      }
      const toSave = Object.assign({}, updates.phone && { phone: updates.phone });
      if (finalPic) toSave.profilePic = finalPic;
      const updated = yield this.studentRepo.updateById(userId, toSave);
      if (!updated) throw new Error('Failed to update profile');
      return updated;
    });
  }
}
exports.StudentService = StudentService;
