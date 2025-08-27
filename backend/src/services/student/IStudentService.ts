import { IStudent } from '../../models/student/studentSchema';

export interface IStudentService {
  registerStudentService(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ student: IStudent; token: string }>;
  loginStudentService(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    student: {
      id: string;
      email: string;
      name: string;
    };
  }>;
}
