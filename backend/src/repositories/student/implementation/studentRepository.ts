import Student, { Istudent } from "../../../models/student/studentSchema";
import { BaseRepository } from "../../base/BaseRepository";
import { IstudentRepository } from "../IStudentRepository";

export class StudentRepository extends BaseRepository<Istudent> implements IstudentRepository {
  constructor() {
    super(Student);
  }

  async findByEmail(email: string): Promise<Istudent | null> {
    return Student.findOne({ email });
  }

  async updateIsVerified(email: string): Promise<void> {
  await Student.updateOne({ email }, { isVerified: true });
}

async countDocuments(filter: any): Promise<number> {
  return Student.countDocuments(filter);
}

async findMany(
  filter: any,
  options: { skip?: number; limit?: number; sort?: any }
): Promise<Istudent[]> {
  return Student.find(filter)
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .sort(options.sort || {});
}

async updateBlockStatus(id: string, isBlocked: boolean): Promise<void> {
  await Student.findByIdAndUpdate(id, { isBlocked });
}


}