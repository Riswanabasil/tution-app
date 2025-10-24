import { StudentDTO } from '../../dto/admin/student';
import { IStudent } from '../../models/student/studentSchema';

export interface GetStudentsResult {
  students: StudentDTO[];
  totalPages: number;
}

export interface IStudentAdminService {
  getAllStudents(
    page: number,
    limit: number,
    search: string,
    sort: string,
    order: number,
  ): Promise<GetStudentsResult>;
  blockStudent(studentId: string, block: boolean): Promise<void>;
}
