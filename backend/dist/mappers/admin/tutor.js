"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorMapper = void 0;
class TutorMapper {
    static toDTO(t) {
        return {
            _id: t._id.toString(),
            id: t._id.toString(),
            name: t.name,
            email: t.email,
            status: t.status,
            phone: t.phone,
            assignedCourses: Array.isArray(t.assignedCourses)
                ? t.assignedCourses.map((c) => { var _a; return typeof c === 'string' ? { _id: c } : { _id: (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString(), title: c.title }; })
                : undefined,
            verificationDetails: t.verificationDetails
                ? {
                    education: t.verificationDetails.education,
                    experience: t.verificationDetails.experience,
                    summary: t.verificationDetails.summary,
                    idProof: t.verificationDetails.idProof,
                    resume: t.verificationDetails.resume,
                }
                : undefined,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
        };
    }
    static toDTOList(arr) {
        return arr.map(this.toDTO);
    }
}
exports.TutorMapper = TutorMapper;
