import { ProfileDTO } from '../../dto/student/profile';

export class StudentMapper {
  static toProfileDTO(student: any): ProfileDTO {
    if (!student) return null as any;
    return {
      _id: student._id?.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone ?? null,
      profilePic: student.profilePic ?? null,
      profilePicKey: student.profilePicKey ?? null,
      isBlocked: !!student.isBlocked,
      createdAt: student.createdAt ? student.createdAt.toISOString() : undefined,
      updatedAt: student.updatedAt ? student.updatedAt.toISOString() : undefined,
    };
  }
}
