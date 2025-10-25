'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
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
exports.TutorRepository = void 0;
const TutorSchema_1 = __importDefault(require('../../../models/tutor/TutorSchema'));
const CourseSchema_1 = require('../../../models/course/CourseSchema');
const BaseRepository_1 = require('../../base/BaseRepository');
const Enrollment_1 = require('../../../models/payment/Enrollment');
class TutorRepository extends BaseRepository_1.BaseRepository {
  constructor() {
    super(TutorSchema_1.default);
  }
  findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default.findOne({ email });
    });
  }
  updateVerificationById(tutorId, verificationDetails) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default.findByIdAndUpdate(
        tutorId,
        {
          status: 'verification-submitted',
          verificationDetails,
        },
        { new: true },
      );
    });
  }
  getAllWithFilters(query, skip, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
      // .populate("assignedCourses", "title");
    });
  }
  countAllWithFilters(query) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default.countDocuments(query);
    });
  }
  // async getTutorById(id: string): Promise<ITutor | null> {
  //   return Tutor.findById(id);
  // }
  getTutorById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default
        .findById(id)
        .select('name email phone isGoogleSignup status verificationDetails')
        .lean()
        .exec();
    });
  }
  updateTutorStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
      const updated = yield TutorSchema_1.default.findByIdAndUpdate(id, { status });
      return !!updated;
    });
  }
  updateById(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default
        .findByIdAndUpdate(id, updates, { new: true })
        .select('-password')
        .lean()
        .exec();
    });
  }
  countCoursesByTutor(tutorId) {
    return __awaiter(this, void 0, void 0, function* () {
      return CourseSchema_1.Course.countDocuments({ tutor: tutorId }).exec();
    });
  }
  countStudentsByTutor(tutorId) {
    return __awaiter(this, void 0, void 0, function* () {
      const courses = yield CourseSchema_1.Course.find({ tutor: tutorId }).select('_id').lean();
      const ids = courses.map((c) => c._id);
      return Enrollment_1.EnrollmentModel.countDocuments({
        courseId: { $in: ids },
        status: 'paid',
      }).exec();
    });
  }
  findCoursesByTutor(tutorId) {
    return __awaiter(this, void 0, void 0, function* () {
      const courses = yield CourseSchema_1.Course.find({ tutor: tutorId })
        .select('title status')
        .lean();
      //  aggregate
      return Promise.all(
        courses.map((c) =>
          __awaiter(this, void 0, void 0, function* () {
            const studentCount = yield Enrollment_1.EnrollmentModel.countDocuments({
              courseId: c._id,
              status: 'paid',
            }).exec();
            return {
              _id: c._id.toString(),
              title: c.title,
              status: c.status,
              studentCount,
            };
          }),
        ),
      );
    });
  }
  incrementWallet(tutorId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
      yield TutorSchema_1.default
        .findByIdAndUpdate(tutorId, { $inc: { walletBalance: amount } }, { new: true })
        .exec();
    });
  }
  countByStatusMap() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const rows = yield (yield Promise.resolve().then(() =>
        __importStar(require('../../../models/tutor/TutorSchema')),
      )).default
        .aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }])
        .exec();
      return {
        pending:
          (_b =
            (_a = rows.find((r) => r._id === 'pending')) === null || _a === void 0
              ? void 0
              : _a.n) !== null && _b !== void 0
            ? _b
            : 0,
        'verification-submitted':
          (_d =
            (_c = rows.find((r) => r._id === 'verification-submitted')) === null || _c === void 0
              ? void 0
              : _c.n) !== null && _d !== void 0
            ? _d
            : 0,
        approved:
          (_f =
            (_e = rows.find((r) => r._id === 'approved')) === null || _e === void 0
              ? void 0
              : _e.n) !== null && _f !== void 0
            ? _f
            : 0,
        rejected:
          (_h =
            (_g = rows.find((r) => r._id === 'rejected')) === null || _g === void 0
              ? void 0
              : _g.n) !== null && _h !== void 0
            ? _h
            : 0,
      };
    });
  }
  findByIds(ids) {
    return __awaiter(this, void 0, void 0, function* () {
      return TutorSchema_1.default
        .find({ _id: { $in: ids } })
        .select('_id name email')
        .lean()
        .exec();
    });
  }
  listByStatuses(statuses, limit) {
    return __awaiter(this, void 0, void 0, function* () {
      const docs = yield TutorSchema_1.default
        .find({ status: { $in: statuses } })
        .select('_id name email status createdAt')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();
      return docs.map((d) => ({
        _id: String(d._id),
        name: d.name,
        email: d.email,
        status: d.status,
        createdAt: d.createdAt,
      }));
    });
  }
  getWalletBalance(tutorId) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const doc = yield TutorSchema_1.default
        .findById(tutorId)
        .select('walletBalance')
        .lean()
        .exec();
      return (_a = doc === null || doc === void 0 ? void 0 : doc.walletBalance) !== null &&
        _a !== void 0
        ? _a
        : 0;
    });
  }
}
exports.TutorRepository = TutorRepository;
