export interface IOtpService {
  generateAndSendOtp(email: string): Promise<string>;
}
