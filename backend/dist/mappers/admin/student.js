"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentMapper = void 0;
class StudentMapper {
    static toDTO(student) {
        return {
            _id: student._id.toString(),
            name: student.name,
            email: student.email,
            isBlocked: student.isBlocked,
        };
    }
    static toDTOList(students) {
        return students.map(this.toDTO);
    }
}
exports.StudentMapper = StudentMapper;
