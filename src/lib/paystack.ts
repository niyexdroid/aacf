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
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    // Check if Paystack is already loaded
    if ((window as any).PaystackPop) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    if ((window as any).paystackLoading) {
      const checkInterval = setInterval(() => {
        if ((window as any).PaystackPop) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Paystack script loading timeout"));
      }, 10000);

      return;
    }

    // Mark that we're loading the script
    (window as any).paystackLoading = true;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      delete (window as any).paystackLoading;
      resolve();
    };
    script.onerror = () => {
      delete (window as any).paystackLoading;
      reject(new Error("Failed to load Paystack script"));
    };

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
