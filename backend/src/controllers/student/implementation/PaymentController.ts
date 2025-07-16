// src/controllers/PaymentController.ts
import { Request, Response } from "express";
import { PaymentService } from "../../../services/student/implementation/PaymentService";
import { AuthenticatedRequest } from "../../../types/Index";

export class PaymentController {
  constructor(private paymentService :PaymentService) {}
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId, amount } = req.body;
      const userId = req.user!.id;; 
      const { razorpayOrderId, currency, enrollmentId } =
        await this.paymentService.createOrder(userId, courseId, amount);

      res.status(201).json({
        message: "Order created successfully",
        data: {
          razorpayOrderId,
          amount,
          currency,
          enrollmentId,
        },
      });
    } catch (error: any) {
      console.error("Create Order Error:", error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body;

      await this.paymentService.verifyAndUpdate(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      );

      res.status(200).json({
        message: "Payment verified and enrollment updated",
      });
    } catch (error: any) {
      console.error("Verify Payment Error:", error);
      res
        .status(400)
        .json({ message: error.message || "Payment verification failed" });
    }
  }

   async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.body;
      await this.paymentService.cancelEnrollment(enrollmentId);
      res.status(200).json({ status: "cancelled" });
    } catch (err: any) {
      console.error("Cancel Payment Error:", err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  }

async getMyCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      const list = await this.paymentService.getMyCourses(userId);
      res.json({ data: list });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }

   async getStats(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const stats = await this.paymentService.getStats(userId);
    res.json({ data: stats });
  }

  async getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const list = await this.paymentService.getPaymentHistory(userId);
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
}
