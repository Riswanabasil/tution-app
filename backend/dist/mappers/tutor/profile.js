"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorMapper = void 0;
class TutorMapper {
    static toProfileDTO(t) {
        var _a, _b, _c, _d;
        if (!t)
            return null;
        return {
            _id: (_a = t._id) === null || _a === void 0 ? void 0 : _a.toString(),
            name: t.name,
            email: t.email,
            phone: (_b = t.phone) !== null && _b !== void 0 ? _b : null,
            profilePic: (_c = t.profilePic) !== null && _c !== void 0 ? _c : null,
            profilePicKey: (_d = t.profilePicKey) !== null && _d !== void 0 ? _d : null,
            role: t.role,
            status: t.status,
            walletBalance: typeof t.walletBalance === 'number' ? t.walletBalance : 0,
            verificationDetails: t.verificationDetails
                ? {
                    summary: t.verificationDetails.summary,
                    education: t.verificationDetails.education,
                    experience: t.verificationDetails.experience,
                    idProof: t.verificationDetails.idProof,
                    resume: t.verificationDetails.resume,
                }
                : null,
            createdAt: t.createdAt ? t.createdAt.toISOString() : undefined,
            updatedAt: t.updatedAt ? t.updatedAt.toISOString() : undefined,
        };
    }
}
exports.TutorMapper = TutorMapper;
