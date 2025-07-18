import axios from "../../../api/AxiosInstance";
import type { RazorpayPaymentResponse } from "../../../types/razorpay";

export interface CreateOrderResponse {
  razorpayOrderId: string;
  currency:        string;
  enrollmentId:    string;
}

/**
 * 1️⃣ Create a Razorpay order + pending enrollment
 */
export const createOrder = async (
  courseId: string,
  amount:   number
): Promise<CreateOrderResponse> => {
  const res = await axios.post<{ data: CreateOrderResponse }>(
    "/student/payments/order",
    { courseId, amount }
  );
  return res.data.data;
};

/**
 * 2️⃣ Verify a successful payment
 */
export const verifyPayment = async (
  response:      RazorpayPaymentResponse,
  enrollmentId:  string
): Promise<void> => {
  await axios.post("/student/payments/verify", {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id:   response.razorpay_order_id,
    razorpay_signature:  response.razorpay_signature,
    enrollmentId,
  });
};

/**
 * 3️⃣ Mark a canceled/pending enrollment as failed
 */
export const cancelEnrollment = async (
  enrollmentId: string
): Promise<void> => {
  await axios.post("/student/payments/cancel", { enrollmentId });
};

export const retryOrder = async (
  enrollmentId: string
): Promise<CreateOrderResponse> => {
  const res = await axios.post<{ data: CreateOrderResponse }>(
    "/student/payments/retry",
    { enrollmentId }
  );
  return res.data.data;
};