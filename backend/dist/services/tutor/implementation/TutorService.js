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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = void 0;
const GenerateToken_1 = require("../../../utils/GenerateToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const profile_1 = require("../../../mappers/tutor/profile");
class TutorService {
    constructor(tutorRepo, hasher, tokenService) {
        this.tutorRepo = tutorRepo;
        this.hasher = hasher;
        this.tokenService = tokenService;
    }
    registerTutor(name, email, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.tutorRepo.findByEmail(email);
            if (existing)
                throw new Error('Tutor already exists');
            const hashed = yield this.hasher.hash(password);
            const newTutor = yield this.tutorRepo.create({
                name,
                email,
                phone,
                password: hashed,
                isGoogleSignup: false,
                status: 'pending',
                role: 'tutor',
            });
            return {
                id: newTutor._id.toString(),
                name: newTutor.name,
                email: newTutor.email,
                phone: newTutor.phone,
                role: newTutor.role,
                status: newTutor.status,
            };
        });
    }
    submitTutorVerification(tutorId, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.tutorRepo.updateVerificationById(tutorId, details);
            if (!updated)
                throw new Error('Tutor not found');
            return updated;
        });
    }
    loginTutor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this.tutorRepo.findByEmail(email);
            if (!tutor)
                throw new Error('Tutor not found');
            if (tutor.status !== 'approved') {
                throw new Error('VERIFICATION_PENDING');
            }
            const valid = yield this.hasher.compare(password, tutor.password);
            if (!valid)
                throw new Error('Incorrect password');
            const accessToken = (0, GenerateToken_1.generateAccessToken)(tutor._id.toString(), tutor.email, tutor.role);
            const refreshToken = (0, GenerateToken_1.generateRefreshToken)(tutor._id.toString(), tutor.email, tutor.role);
            return {
                accessToken,
                refreshToken,
                tutor: {
                    id: tutor._id.toString(),
                    email: tutor.email,
                    name: tutor.name,
                    role: tutor.role,
                    status: tutor.status,
                },
            };
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tokenService.verifyRefreshTokenAndGenerateAccess(refreshToken);
        });
    }
    googleLoginTutorService(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const google = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = yield google.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.email) || !(payload === null || payload === void 0 ? void 0 : payload.name)) {
                throw new Error('Invalid Google token');
            }
            const { email, name } = payload;
            let tutor = yield this.tutorRepo.findByEmail(email);
            if (!tutor) {
                tutor = yield this.tutorRepo.create({
                    name,
                    email,
                    phone: '',
                    password: '',
                    isGoogleSignup: true,
                    status: 'pending',
                    role: 'tutor',
                });
            }
            else if (!tutor.isGoogleSignup) {
                tutor.isGoogleSignup = true;
                yield tutor.save();
            }
            const accessToken = (0, GenerateToken_1.generateAccessToken)(tutor._id.toString(), tutor.email, tutor.role);
            const refreshToken = (0, GenerateToken_1.generateRefreshToken)(tutor._id.toString(), tutor.email, tutor.role);
            return {
                accessToken,
                refreshToken,
                tutor: {
                    id: tutor._id.toString(),
                    name: tutor.name,
                    email: tutor.email,
                    status: tutor.status,
                },
            };
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this.tutorRepo.getTutorById(userId);
            if (!tutor)
                throw new Error('Tutor not found');
            // return tutor;
            const dto = profile_1.TutorMapper.toProfileDTO(tutor);
            return dto;
        });
    }
    updateProfile(userId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.tutorRepo.updateById(userId, updates);
            if (!updated)
                throw new Error('Failed to update tutor profile');
            return updated;
        });
    }
    changePassword(userId, current, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this.tutorRepo.getTutorById(userId);
            if (!tutor)
                throw new Error('Tutor not found');
            const match = yield bcrypt_1.default.compare(current, tutor.password);
            if (!match)
                throw new Error('Current password incorrect');
            const hash = yield bcrypt_1.default.hash(next, 10);
            yield this.tutorRepo.updateById(userId, { password: hash });
        });
    }
    getStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseCount = yield this.tutorRepo.countCoursesByTutor(userId);
            const studentCount = yield this.tutorRepo.countStudentsByTutor(userId);
            return { courseCount, studentCount };
        });
    }
    getMyCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tutorRepo.findCoursesByTutor(userId);
        });
    }
}
exports.TutorService = TutorService;
