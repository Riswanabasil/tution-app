import Student, { IStudent } from "../../../models/student/studentSchema";
import { BaseRepository } from "../../base/BaseRepository";
import { IStudentRepository } from "../IStudentRepository";

export class StudentRepository
  extends BaseRepository<IStudent>
  implements IStudentRepository
{
  constructor() {
    super(Student);
    
  }

  async findByEmail(email: string): Promise<IStudent | null> {
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
  ): Promise<IStudent[]> {
    return Student.find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || {});
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<void> {
    await Student.findByIdAndUpdate(id, { isBlocked });
  }

  async findById(id: string): Promise<IStudent | null> {
    return Student.findById(id).exec();
  }

  async updateById(
    id: string,
    updates: Partial<Pick<IStudent, "phone" | "profilePic">>
  ): Promise<IStudent | null> {
    return Student.findByIdAndUpdate(id, updates, { new: true })
      .select("-password")
      .exec();
  }

  async changePassword(
    id: string,
    newHashedPassword: string
  ): Promise<IStudent | null> {
    return Student.findByIdAndUpdate(
      id,
      { password: newHashedPassword },
      { new: true }
    )
      .select("-password")
      .exec();
  }

    async updatePasswordByEmail(email: string, passwordHash: string): Promise<void> {
    const res = await Student.updateOne(
      { email },
      { $set: { password: passwordHash } }
    );
    if (res.matchedCount === 0) {
      throw new Error('Account not found');
    }
  }
    async countAll(): Promise<number> {
    return Student.countDocuments({});
  }

  async countVerified(): Promise<number> {
    return Student.countDocuments({ isVerified: true });
  }
   async getAuthStateById(
    id: string
  ): Promise<{ isBlocked: boolean } | null> {
    const doc = await Student.findById(id)
      .select("isBlocked")
      .lean<{ isBlocked?: boolean } | null>();
    return doc ? { isBlocked: !!doc.isBlocked } : null;
  }
}
