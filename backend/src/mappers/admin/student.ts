import { StudentDTO } from "../../dto/admin/student";
import { IStudent } from "../../models/student/studentSchema";

export class StudentMapper {
  static toDTO(student: IStudent): StudentDTO {
    return {
      _id: student._id.toString(),
      name: student.name,
      email: student.email,
      isBlocked: student.isBlocked
    };
  }

  static toDTOList(students: IStudent[]): StudentDTO[] {
    return students.map(this.toDTO);
  }
}