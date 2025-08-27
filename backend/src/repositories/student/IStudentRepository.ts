import { IStudent } from '../../models/student/studentSchema';

export interface IStudentRepository {
  create(student: Partial<IStudent>): Promise<IStudent>;
  findById(id: string): Promise<IStudent | null>;
  findAll(): Promise<IStudent[]>;
  update(id: string, data: Partial<IStudent>): Promise<IStudent | null>;
  delete(id: string): Promise<boolean>;
  countDocuments(filter: any): Promise<number>;
  findMany(
    filter: any,
    options: { skip?: number; limit?: number; sort?: any },
  ): Promise<IStudent[]>;
  findByEmail(email: string): Promise<IStudent | null>;
  updateIsVerified(email: string): Promise<void>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<void>;
  updateById(
    id: string,
    updates: Partial<Pick<IStudent, 'phone' | 'profilePic'>>,
  ): Promise<IStudent | null>;
  changePassword(id: string, newHashedPassword: string): Promise<IStudent | null>;
  updatePasswordByEmail(email: string, passwordHash: string): Promise<void>;
  countAll(): Promise<number>;
  countVerified(): Promise<number>;
}
