import React from "react";
import axios from "../../../api/AxiosInstance";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import type { RazorpayPaymentResponse } from "../../../types/razorpay";
import Swal from "sweetalert2"

interface PaymentButtonProps {
  courseId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  amount,
  onSuccess,
  onError,
}) => {
  const handleClick = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return onError?.("Failed to load Razorpay SDK");

    try {
      const { data } = await axios.post("/student/payments/order", {
        courseId,
        amount,
      });

      const { razorpayOrderId, currency, enrollmentId } = data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        order_id: razorpayOrderId,
        name: "TechTute",
        description: "Course Enrollment",
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await axios.post("/student/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId,
            });
            onSuccess?.();
          } catch (err) {
            onError?.(err);
          }
        },
        modal: {
          ondismiss: async () => {
            await axios.post("/student/payments/cancel", {
              enrollmentId,
            });
           Swal.fire({
     title: "Payment Cancelled",
     text:  "Please try again later.",
     icon:  "error",
     confirmButtonText: "OK",
   });
          },
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3399cc",
        },
      };

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
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Enroll for ₹{amount}
    </button>
  );
};
