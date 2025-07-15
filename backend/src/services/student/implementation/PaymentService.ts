// src/services/PaymentService.ts
import { Types } from "mongoose";
import { razorpay } from "../../../config/razorpay";
import { IEnrollment } from "../../../models/payment/Enrollment";
import { EnrollmentRepository } from "../../../repositories/payment/implementation/EnrollmentRepository";

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export class PaymentService {
  constructor(private repo:EnrollmentRepository) {}

  async createOrder(
    userId: string,
    courseId: string,
    amount: number       
  ): Promise<{
    razorpayOrderId: string;
    amount: number;   
    currency: string;
    enrollmentId: string;
  }> {
    const options = {
      amount: amount * 100,     
      currency: "INR",
      receipt: `rcpt_${courseId.substring(0, 10)}_${Date.now()}`,
    };

    const order = await new Promise<RazorpayOrder>((resolve, reject) => {
      
      razorpay.orders.create(options, (err: any, o: any) => {
        if (err) return reject(err);
        resolve(o as RazorpayOrder);
      });
    });

   
    const enrollment = await this.repo.create({
      userId:new Types.ObjectId(userId),
      courseId:new Types.ObjectId(courseId),
      razorpayOrderId: order.id,
      amount,
      status: "pending",
    } as Partial<IEnrollment>);

    return {
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: enrollment._id.toString()
    };
  }

  async verifyAndUpdate(paymentId: string, orderId: string, signature: string) {
    
    const crypto = await import("crypto");
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${orderId}|${paymentId}`);
    if (shasum.digest("hex") !== signature) {
      throw new Error("Invalid signature");
    }
    return this.repo.updateStatus(orderId, "paid");
  }

   async cancelEnrollment(enrollmentId: string) {
    return this.repo.updateById(enrollmentId, "failed");
  }

  async getMyCourses(userId: string) {
    const enrollments = await this.repo.findPaidByUser(userId);
    return enrollments.map(e => ({
      enrollmentId: e._id.toString(),
      course: e.courseId,   
      enrolledAt: e.createdAt,
    }));
  }
}
