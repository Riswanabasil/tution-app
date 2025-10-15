
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../types/Index';
import { HttpStatus } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { IPaymentService } from '../../../services/student/IPaymentService';

export class PaymentController {
  constructor(private paymentService: IPaymentService) {}
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId, amount } = req.body;
      const userId = req.user!.id;
      const { razorpayOrderId, currency, enrollmentId } = await this.paymentService.createOrder(
        userId,
        courseId,
        amount,
      );

      res.status(HttpStatus.CREATED).json({
        message: 'Order created successfully',
        data: {
          razorpayOrderId,
          amount,
          currency,
          enrollmentId,
        },
      });
    } catch (e: any) {
      // catch (error) {
      //   console.error('Create Order Error:', error);
      //   res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      // }
      const status = e?.status === 409 ? 409 : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        e?.status === 409
          ? 'You already purchased this course'
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      await this.paymentService.verifyAndUpdate(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      );

      res.status(HttpStatus.OK).json({
        message: 'Payment verified and enrollment updated',
      });
    } catch (error) {
      console.error('Verify Payment Error:', error);
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }
  }

  async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.body;
      await this.paymentService.cancelEnrollment(enrollmentId);
      res.status(HttpStatus.OK).json({ status: 'cancelled' });
    } catch (err) {
      console.error('Cancel Payment Error:', err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getMyCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const list = await this.paymentService.getMyCourses(userId);
      res.json({ data: list });
    } catch (err) {
      console.error(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
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
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
  async retryOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.body;
      if (!enrollmentId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing enrollmentId' });
        return;
      }

      const payload = await this.paymentService.retryOrder(enrollmentId);
      res.json({ data: payload });
      return;
    } catch (err) {
      console.error(' retryOrder error:', err);
      res.status(HttpStatus.BAD_REQUEST).json({ message: ERROR_MESSAGES.BAD_REQUEST });
      return;
    }
  }
}
