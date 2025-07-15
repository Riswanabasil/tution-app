
export interface RazorpayOptions {
  key: string;
  amount: number;          
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  image?: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


export interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (resp) => void): void;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}
