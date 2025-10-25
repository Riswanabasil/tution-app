import { ProfileDTO } from '../../dto/student/profile';
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
  refreshAccessToken(refreshToken: string): Promise<string>;
  googleLoginStudentService(idToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    student: {
      id: string;
      email: string;
      name: string;
    };
  }> ;
  getProfile(userId: string):Promise<ProfileDTO>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
  updateProfile(
    userId: string,
    updates: { name?: string; phone?: string; profilePicKey?: string },
  ): Promise<IStudent>;
}
