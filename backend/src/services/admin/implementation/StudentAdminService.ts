import { IStudentAdminService, GetStudentsResult } from "../IStudentAdminService";
import { IStudentRepository } from "../../../repositories/student/IStudentRepository";

export class StudentAdminService implements IStudentAdminService {
  constructor(private studentRepo: IStudentRepository) {}

  async getAllStudents(
    page: number,
    limit: number,
    search: string,
    sort: string,
    order: number
  ): Promise<GetStudentsResult> {
    const skip = (page - 1) * limit;
    const filter = search
      ? { $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ] }
      : {};

    const total = await this.studentRepo.countDocuments(filter);
    const students = await this.studentRepo.findMany(filter, { skip, limit, sort: { [sort]: order } });

    return { students, totalPages: Math.ceil(total / limit) };
  }

  async blockStudent(studentId: string, block: boolean): Promise<void> {
    await this.studentRepo.updateBlockStatus(studentId, block);
  }
}
