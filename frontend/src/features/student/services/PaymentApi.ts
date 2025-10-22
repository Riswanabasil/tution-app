import { getAxios } from '../../../api/Axios';
const axios = getAxios('student');
import type { RazorpayPaymentResponse } from '../../../types/razorpay';

export interface CreateOrderResponse {
  razorpayOrderId: string;
  currency: string;
  enrollmentId: string;
}
export const createOrder = async (
  courseId: string,
  amount: number,
): Promise<CreateOrderResponse> => {
  const res = await axios.post<{ data: CreateOrderResponse }>('/student/payments/order', {
    courseId,
    amount,
  });
  return res.data.data;
};
export const verifyPayment = async (
  response: RazorpayPaymentResponse,
  enrollmentId: string,
  courseId?:string
): Promise<void> => {
  await axios.post('/student/payments/verify', {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    enrollmentId,
  });
};
export const cancelEnrollment = async (enrollmentId: string): Promise<void> => {
  await axios.post('/student/payments/cancel', { enrollmentId });
};

export const retryOrder = async (enrollmentId: string): Promise<CreateOrderResponse> => {
  const res = await axios.post<{ data: CreateOrderResponse }>('/student/payments/retry', {
    enrollmentId,
  });
  return res.data.data;
};
