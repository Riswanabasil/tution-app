import { Types } from 'mongoose';
import { razorpay } from '../../../config/razorpay';
import { IEnrollment } from '../../../models/payment/Enrollment';
import { EnrollmentRepository } from '../../../repositories/payment/implementation/EnrollmentRepository';
import { TutorRepository } from '../../../repositories/tutor/implementation/TutorRepository';
import { CourseRepository } from '../../../repositories/course/implementation/CourseRepository';
import { IPaymentService } from '../IPaymentService';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export class PaymentService implements IPaymentService{
  constructor(
    private repo: EnrollmentRepository,
    private tutorRepo: TutorRepository,
    private courseRepo: CourseRepository,
  ) {}

  async createOrder(
    userId: string,
    courseId: string,
    amount: number,
  ): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    enrollmentId: string;
  }> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${courseId.substring(0, 10)}_${Date.now()}`,
    };

    const order = await new Promise<RazorpayOrder>((resolve, reject) => {
      razorpay.orders.create(options, (err: any, o: any) => {
        if (err) return reject(err);
        resolve(o as RazorpayOrder);
      });
    });

    const enrollment = await this.repo.create({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      razorpayOrderId: order.id,
      amount,
      status: 'pending',
    } as Partial<IEnrollment>);

    return {
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: enrollment._id.toString(),
    };
  }

  async verifyAndUpdate(paymentId: string, orderId: string, signature: string) {
    const crypto = await import('crypto');
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${orderId}|${paymentId}`);
    if (shasum.digest('hex') !== signature) {
      throw new Error('Invalid signature');
    }
    const enrollment = await this.repo.updateStatus(orderId, 'paid');
    if (!enrollment) throw new Error('Enrollment not found');
    let courseId: string;
    if (enrollment.courseId instanceof Types.ObjectId) {
      courseId = enrollment.courseId.toHexString();
    } else {
      courseId = enrollment.courseId._id.toString();
    }

    const course = await this.courseRepo.findById(courseId);
    if (!course) throw new Error('Course not found');

    const payout = Math.round(enrollment.amount * 0.7 * 100) / 100;

    await this.tutorRepo.incrementWallet(course.tutor.toString(), payout);
  }

  async cancelEnrollment(enrollmentId: string) {
    return this.repo.updateById(enrollmentId, 'failed');
  }

  async getMyCourses(userId: string) {
    const enrollments = await this.repo.findPaidByUser(userId);
    return enrollments.map((e) => ({
      enrollmentId: e._id.toString(),
      course: e.courseId.toString(),
      enrolledAt: e.createdAt,
    }));
  }

  async getStats(userId: string) {
    const totalEnrolled = await this.repo.countPaidByUser(userId);
    return { totalEnrolled };
  }

  async getPaymentHistory(userId: string) {
    const enrollments = await this.repo.findPaymentHistory(userId);

    return enrollments.map((e) => ({
      enrollmentId: e._id,
      courseId: (e.courseId as any)._id.toString(),
      title: (e.courseId as any).title,
      thumbnail: (e.courseId as any).thumbnail,
      status: e.status,
      amount: e.amount,
      paidAt: e.createdAt.toISOString(),
    }));
  }

  async retryOrder(enrollmentId: string) {
    const old = await this.repo.findById(enrollmentId);
    console.log(old);

    if (!old) throw new Error('Enrollment not found');
    if (old.status !== 'failed') {
      throw new Error('Can only retry failed payments');
    }

    const options = {
      amount: old.amount * 100,
      currency: 'INR',
      receipt: `retry_${enrollmentId.substring(0, 10)}_${Date.now()}`,
    };

    const order = await new Promise<RazorpayOrder>((resolve, reject) => {
      razorpay.orders.create(options, (err: any, o: any) => {
        if (err) return reject(err);
        resolve(o as RazorpayOrder);
      });
    });
    await this.repo.update(enrollmentId, {
      razorpayOrderId: order.id,
      status: 'pending',
    });

    return {
      razorpayOrderId: order.id,
      currency: order.currency,
      enrollmentId,
    };
  }
}
