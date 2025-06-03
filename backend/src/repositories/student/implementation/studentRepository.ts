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

}