// Paystack configuration and utilities

export interface PaystackConfig {
  publicKey: string;
  currency: string;
}

export const paystackConfig: PaystackConfig = {
  publicKey:
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
  currency: "NGN",
};

// Initialize Paystack script
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
};

// Generate unique reference
export const generateReference = (prefix: string = "DONATE"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

// Format amount for Paystack (in kobo for NGN)
export const formatAmount = (
  amount: number,
  currency: string = "NGN",
): number => {
  if (currency === "NGN") {
    return amount * 100; // Convert to kobo
  }
  return amount;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate amount
export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000; // Max 10 million NGN
};
