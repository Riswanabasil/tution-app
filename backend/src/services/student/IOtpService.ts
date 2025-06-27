export interface IOtpService{
    verifyOtp(email: string, otp: string): Promise<string>
    resendOtp(email: string): Promise<string>
}