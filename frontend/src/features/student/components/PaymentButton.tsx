
import React from "react";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import Swal from "sweetalert2";

import {
  createOrder,
  verifyPayment,
  cancelEnrollment,
  type CreateOrderResponse,
  retryOrder,
} from "../services/PaymentApi";
import type { RazorpayPaymentResponse } from "../../../types/razorpay";

interface PaymentButtonProps {
   courseId?:      string
  enrollmentId?:  string
  amount:   number;
  onSuccess?: () => void;
  onError?:   (error: unknown) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  enrollmentId,
  amount,
  onSuccess,
  onError,
}) => {
 
  const handleClick = async () => {
    // 1) load SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      return onError?.("Failed to load Razorpay SDK");
    }

    try {
      // 2) create vs retry
      let payload: CreateOrderResponse;
      console.log(enrollmentId);
      
      if (enrollmentId) {
        payload = await retryOrder(enrollmentId);
      } else {
        payload = await createOrder(courseId!, amount);
      }
      const { razorpayOrderId, currency, enrollmentId: eid } = payload;

      // 3) configure checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        order_id: razorpayOrderId,
        name: "TechTute",
        description: "Course Enrollment",
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // 4) verify payment
            await verifyPayment(response, eid);
            onSuccess?.();
          } catch (err) {
            onError?.(err);
          }
        },
        modal: {
          ondismiss: async () => {
            // 5) cancel on user dismiss
            await cancelEnrollment(eid);
            Swal.fire({
              title: "Payment Cancelled",
              text: "Your enrollment has been marked as failed.",
              icon: "error",
              confirmButtonText: "OK",
            });
          },
        },
        prefill: { name: "", email: "", contact: "" },
        theme:   { color: "#3399cc" },
      };

      // 6) open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        onError?.(
          `Payment failed: ${resp.error.description} (reason: ${resp.error.reason})`
        );
      });
      rzp.open();
    } catch (err) {
      onError?.(err);
    }
  };

  return (
 <button
  onClick={handleClick}
  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
>
  {enrollmentId ? "Retry Payment" : `Enroll for ₹${amount}`}
</button>
  );
}
