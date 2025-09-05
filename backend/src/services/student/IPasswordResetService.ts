export interface IPasswordResetService {
  requestReset(email: string): Promise<void>;
  verifyResetOtp(email: string, otp: string): Promise<void>;
  resetWithOtp(email: string, newPassword: string, confirmPassword: string): Promise<void>;
}
