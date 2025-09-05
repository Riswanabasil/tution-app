import { IEnrollment } from '../../models/payment/Enrollment';

export interface IPaymentService {
  createOrder(
    userId: string,
    courseId: string,
    amount: number,
  ): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    enrollmentId: string;
  }>;

  verifyAndUpdate(paymentId: string, orderId: string, signature: string): Promise<void>;

  cancelEnrollment(enrollmentId: string): Promise<IEnrollment | null>;

  getMyCourses(userId: string): Promise<
    Array<{
      enrollmentId: string;
      course: { _id: string; title: string; thumbnail?: string; price?: number };
      enrolledAt: Date;
    }>
  >;

  getStats(userId: string): Promise<{ totalEnrolled: number }>;

  getPaymentHistory(userId: string): Promise<
    Array<{
      enrollmentId: string;
      courseId: string;
      title: string;
      thumbnail?: string;
      status: string;
      amount: number;
      paidAt: string;
    }>
  >;

  retryOrder(enrollmentId: string): Promise<{
    razorpayOrderId: string;
    currency: string;
    enrollmentId: string;
  }>;
}
