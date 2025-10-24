import { TutorDTO } from "../../dto/admin/tutor";

export class TutorMapper {
  static toDTO(t: any): TutorDTO {
    return {
      _id: t._id.toString(),
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      status: t.status,
      phone: t.phone,
      assignedCourses: Array.isArray(t.assignedCourses)
        ? t.assignedCourses.map((c: any) =>
            typeof c === 'string' ? { _id: c } : { _id: c._id?.toString(), title: c.title },
          )
        : undefined,
      verificationDetails: t.verificationDetails ? {
        education: t.verificationDetails.education,
        experience: t.verificationDetails.experience,
        summary: t.verificationDetails.summary,
        idProof: t.verificationDetails.idProof,
        resume: t.verificationDetails.resume,
      } : undefined,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }

  static toDTOList(arr: any[]): TutorDTO[] {
    return arr.map(this.toDTO);
  }
}