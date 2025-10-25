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
exports.TutorController = void 0;
const s3Presign_1 = require('../../../utils/s3Presign');
const statusCode_1 = require('../../../constants/statusCode');
const errorMessages_1 = require('../../../constants/errorMessages');
class TutorController {
  constructor(tutorService) {
    this.tutorService = tutorService;
  }
  registerTutor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, email, phone, password } = req.body;
        const tutor = yield this.tutorService.registerTutor(name, email, phone, password);
        res.status(statusCode_1.HttpStatus.CREATED).json({
          message: 'Tutor registered successfully',
          tutor,
        });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.BAD_REQUEST)
          .json({ message: errorMessages_1.ERROR_MESSAGES.BAD_REQUEST });
      }
    });
  }
  getVerificationUploadUrls(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { idFilename, idContentType, resumeFilename, resumeContentType } = req.body;
      const idProof = yield (0, s3Presign_1.presignPutObject)({
        keyPrefix: `tutors/verification/id`,
        filename: idFilename,
        contentType: idContentType,
      });
      const resume = yield (0, s3Presign_1.presignPutObject)({
        keyPrefix: `tutors/verification/resume`,
        filename: resumeFilename,
        contentType: resumeContentType,
      });
      res.json({ idProof, resume });
    });
  }
  submitTutorVerification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { summary, education, experience, tutorId, idProofKey, resumeKey } = req.body;
        if (!tutorId || !summary || !education || !experience || !idProofKey || !resumeKey) {
          res
            .status(statusCode_1.HttpStatus.BAD_REQUEST)
            .json({ message: 'Missing required fields' });
        }
        const input = {
          summary,
          education,
          experience,
          idProof: idProofKey,
          resume: resumeKey,
        };
        const updatedTutor = yield this.tutorService.submitTutorVerification(tutorId, input);
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Tutor verification submitted successfully',
          tutor: updatedTutor,
        });
      } catch (error) {
        console.error(error);
        res
          .status(statusCode_1.HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: errorMessages_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    });
  }
  loginTutor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, password } = req.body;
        const result = yield this.tutorService.loginTutor(email, password);
        console.log(email, password);
        const REFRESH_COOKIE = parseInt(process.env.MAX_AGE);
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Login successful',
          accessToken: result.accessToken,
          tutor: result.tutor,
        });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.UNAUTHORIZED)
          .json({ message: errorMessages_1.ERROR_MESSAGES.UNAUTHORIZED });
      }
    });
  }
  logoutTutor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(statusCode_1.HttpStatus.OK).json({ message: 'Tutor logged out successfully' });
    });
  }
  googleLoginTutor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { idToken } = req.body;
        if (!idToken) {
          res
            .status(statusCode_1.HttpStatus.BAD_REQUEST)
            .json({ message: 'Google ID token missing' });
          return;
        }
        const { accessToken, refreshToken, tutor } =
          yield this.tutorService.googleLoginTutorService(idToken);
        const REFRESH_COOKIE = Number(process.env.MAX_AGE);
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(statusCode_1.HttpStatus.OK).json({
          message: 'Google login successful',
          accessToken,
          tutor,
        });
      } catch (err) {
        res
          .status(statusCode_1.HttpStatus.UNAUTHORIZED)
          .json({ message: err.message || 'Unauthorized' });
      }
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
        const newAccessToken = yield this.tutorService.refreshAccessToken(refreshToken);
        res.status(statusCode_1.HttpStatus.OK).json({ accessToken: newAccessToken });
      } catch (error) {
        res
          .status(statusCode_1.HttpStatus.FORBIDDEN)
          .json({ message: errorMessages_1.ERROR_MESSAGES.FORBIDDEN });
      }
    });
  }
  //profile
  getProfileUploadUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { filename, contentType } = req.query;
        const data = yield (0, s3Presign_1.presignPutObject)({
          keyPrefix: 'TutorPic',
          filename,
          contentType,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    });
  }
  getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const tutorId = req.user.id;
      const data = yield this.tutorService.getProfile(tutorId);
      res.json({ data });
    });
  }
  updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const tutorId = req.user.id;
      const profileKey = req.body.profilePicKey;
      const profileilUrl = profileKey
        ? `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/` +
          encodeURIComponent(profileKey)
        : undefined;
      const updates = Object.assign(Object.assign({}, req.body), { profilePic: profileilUrl });
      const data = yield this.tutorService.updateProfile(tutorId, updates);
      res.json({ data });
    });
  }
  //  async updateProfile(req: AuthenticatedRequest, res: Response) {
  //   try {
  //      const tutorId = req.user!.id;
  //     const v = validateUpdateTutorProfileDto(req.body);
  //     if (!v.ok) return res.status(400).json({ message: v.error });
  //     const data = await this.tutorService.updateProfile(tutorId, v.data);
  //      res.json({ data });
  //   } catch (err: any) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Failed to update profile' });
  //   }
  // }
  // Get tutor profile (returns URL)
  // async getProfile(req: Request, res: Response) {
  //   try {
  //     const tutorId = (req as any).user.id;
  //     const data = await this.tutorService.getProfile(tutorId);
  //     res.json(data);
  //   } catch (err: any) {
  //     res.status(404).json({ message: 'Tutor not found' });
  //   }
  // }
  changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const tutorId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      yield this.tutorService.changePassword(tutorId, currentPassword, newPassword);
      res.json({ message: 'Password updated' });
    });
  }
  getStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const tutorId = req.user.id;
      const data = yield this.tutorService.getStats(tutorId);
      res.json({ data });
    });
  }
  getMyCourses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const tutorId = req.user.id;
      const data = yield this.tutorService.getMyCourses(tutorId);
      res.json({ data });
    });
  }
}
exports.TutorController = TutorController;
