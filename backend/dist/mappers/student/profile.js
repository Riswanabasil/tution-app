"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentMapper = void 0;
class StudentMapper {
    static toProfileDTO(student) {
        var _a, _b, _c, _d;
        if (!student)
            return null;
        return {
            _id: (_a = student._id) === null || _a === void 0 ? void 0 : _a.toString(),
            name: student.name,
            email: student.email,
            phone: (_b = student.phone) !== null && _b !== void 0 ? _b : null,
            profilePic: (_c = student.profilePic) !== null && _c !== void 0 ? _c : null,
            profilePicKey: (_d = student.profilePicKey) !== null && _d !== void 0 ? _d : null,
            isBlocked: !!student.isBlocked,
            createdAt: student.createdAt ? student.createdAt.toISOString() : undefined,
            updatedAt: student.updatedAt ? student.updatedAt.toISOString() : undefined,
        };
    }
}
exports.StudentMapper = StudentMapper;
