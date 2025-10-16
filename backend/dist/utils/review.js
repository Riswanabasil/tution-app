"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDTO = toDTO;
function toDTO(doc) {
    const s = doc.studentId;
    const studentId = typeof s === 'object' && (s === null || s === void 0 ? void 0 : s._id) ? String(s._id) : String(s);
    const studentName = typeof s === 'object' && 'name' in s ? s.name : undefined;
    const studentAvatar = typeof s === 'object' && 'profilePic' in s ? s.profilePic : undefined;
    return {
        _id: String(doc._id),
        courseId: String(doc.courseId),
        studentId: String(doc.studentId),
        studentName,
        studentAvatar,
        rating: doc.rating,
        comment: doc.comment,
        isDeleted: !!doc.isDeleted,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}
