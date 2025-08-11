"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Heart, CreditCard, Building } from "lucide-react";
import confetti from "canvas-confetti";
import {
  loadPaystackScript,
  generateReference,
  formatAmount,
  isValidEmail,
  isValidAmount,
} from "@/lib/paystack";

interface DonorFormProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    amount?: number;
    message?: string;
  }) => void;
}

const PREDEFINED_AMOUNTS = [
  { label: "₦1,000", value: 1000 },
  { label: "₦5,000", value: 5000 },
  { label: "₦10,000", value: 10000 },
  { label: "₦25,000", value: 25000 },
  { label: "₦50,000", value: 50000 },
  { label: "₦100,000", value: 100000 },
];

const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Card Payment",
    icon: CreditCard,
    description: "Pay with debit/credit card",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "Direct bank transfer",
  },
];

// Bank Details
const BANK_DETAILS = {
  accountName: "ABOSEDEAINA CHARITY FOUNDATION",
  accountNumber: "0125177942",
  bankName: "WEMA BANK",
};

export function DonorForm({ onSubmit }: DonorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    customAmount: "",
    message: "",
    paymentMethod: "card",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [donationData, setDonationData] = useState<{
    name: string;
    email: string;
    amount: number;
    message: string;
    paymentMethod: string;
  } | null>(null);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);

  const handleMakeAnotherDonation = () => {
    setSuccess(false);
    setDonationData(null);
  };

  useEffect(() => {
    loadPaystackScript()
      .then(() => {
        console.log("Paystack script loaded successfully");
        console.log("PaystackPop available:", !!(window as any).PaystackPop);
        setScriptLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Paystack script:", error);
        setErrors({
          general: "Failed to load payment system. Please refresh the page.",
        });
      });
  }, []);

  // Test Paystack availability
  const testPaystack = () => {
    console.log("Testing Paystack availability...");
    console.log("Window object:", typeof window !== "undefined");
    console.log("PaystackPop:", (window as any).PaystackPop);
    console.log("Script loaded:", scriptLoaded);
    return !!(window as any).PaystackPop;
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti from left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#f97316", "#ea580c", "#c2410c", "#9a3412"],
      });

      // Create confetti from right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#f97316", "#ea580c", "#c2410c", "#9a3412"],
      });
    }, 250);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAmountSelect = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
      customAmount: "",
    }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      customAmount: value,
      amount: value,
    }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Full name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Donation amount is required";
    } else if (!isValidAmount(formData.amount)) {
      newErrors.amount = "Invalid amount";
    }

    // Message validation (optional, but can add custom rules if needed)
    if (formData.message && formData.message.length > 500) {
      newErrors.message = "Message is too long (max 500 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setShowPaymentForm(true);
    }
  };

  const handlePaystackPayment = () => {
    if (!scriptLoaded) {
      setErrors({
        general:
          "Payment system is still loading. Please wait a moment and try again.",
      });
      setIsSubmitting(false);
      return;
    }

    const amountValue =
      parseFloat(formData.amount) || parseFloat(formData.customAmount);

    // Use test key if live key is not available
    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      "pk_test_3cf0c1f9e6a3a4a3a3a3a3a3a3a3a3a3a3a";

    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      email: formData.email,
      amount: formatAmount(amountValue),
      currency: "NGN",
      ref: generateReference(),
      firstname: formData.name.split(" ")[0],
      lastname: formData.name.split(" ").slice(1).join(" "),
      metadata: {
        custom_fields: [
          {
            display_name: "Message",
            variable_name: "message",
            value: formData.message,
          },
        ],
      },
      callback: function (response: any) {
        // Payment successful - save donor information
        fetch("/api/donors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            amount: amountValue,
            message: formData.message,
            paymentStatus: "success",
            paymentReference: response.reference,
            paymentMethod: "paystack",
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              // Store donation data before resetting form
              setDonationData({
                name: formData.name,
                email: formData.email,
                amount: amountValue,
                message: formData.message,
                paymentMethod: formData.paymentMethod,
              });

              // Reset form data
              setFormData({
                name: "",
                email: "",
                amount: "",
                customAmount: "",
                message: "",
                paymentMethod: "card",
              });

              setShowPaymentForm(false);
              setSuccess(true);
              triggerConfetti();

              if (onSubmit) {
                onSubmit({
                  name: formData.name,
                  email: formData.email,
                  amount: amountValue,
                  message: formData.message || undefined,
                });
              }
            } else {
              setErrors({
                general:
                  result.error ||
                  "An error occurred while saving your donation",
              });
            }
          })
          .catch(() => {
            setErrors({
              general: "An error occurred while processing your donation",
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      },
      onClose: function () {
        setIsSubmitting(false);
      },
    });

    try {
      handler.openIframe();
    } catch (error) {
      setErrors({
        general: "Failed to initialize payment. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handleBankTransfer = async () => {
    // For bank transfer, we'll save the donation as pending
    const amountValue =
      parseFloat(formData.amount) || parseFloat(formData.customAmount);

    try {
      const response = await fetch("/api/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          amount: amountValue,
          message: formData.message,
          paymentStatus: "pending",
          paymentReference: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentMethod: "bank_transfer",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store donation data before resetting form
        setDonationData({
          name: formData.name,
          email: formData.email,
          amount: amountValue,
          message: formData.message,
          paymentMethod: formData.paymentMethod,
        });

        // Reset form data
        setFormData({
          name: "",
          email: "",
          amount: "",
          customAmount: "",
          message: "",
          paymentMethod: "card",
        });

        setShowPaymentForm(false);
        setSuccess(true);
        triggerConfetti();

        if (onSubmit) {
          onSubmit({
            name: formData.name,
            email: formData.email,
            amount: amountValue,
            message: formData.message || undefined,
          });
        }
      } else {
        setErrors({
          general:
            result.error || "An error occurred while saving your donation",
        });
      }
    } catch (error) {
      setErrors({
        general: "An error occurred while processing your donation",
      });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (formData.paymentMethod === "card") {
      handlePaystackPayment();
    } else if (formData.paymentMethod === "bank") {
      await handleBankTransfer();
    }
  };

  const getSelectedPaymentMethod = () => {
    return PAYMENT_METHODS.find(
      (method) => method.id === formData.paymentMethod,
    );
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (success && donationData) {
    return (
      <div className="relative rounded-lg bg-green-50 p-8 text-center">
        <canvas
          ref={confettiRef}
          className="pointer-events-none absolute inset-0"
        />
        <Heart className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h3 className="mb-2 text-2xl font-bold text-green-800">
          Thank You for Your Donation!
        </h3>
        <p className="mb-4 text-green-700">
          Your generous contribution of {formatNaira(donationData.amount)} has
          been successfully processed and will help us make a difference in the
          lives of those we serve.
        </p>
        {donationData.paymentMethod === "bank" && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 className="mb-2 font-semibold text-yellow-800">
              Bank Transfer Instructions
            </h4>
            <div className="space-y-1 text-left text-sm text-yellow-700">
              <p>
                <strong>Account Name:</strong> {BANK_DETAILS.accountName}
              </p>
              <p>
                <strong>Account Number:</strong> {BANK_DETAILS.accountNumber}
              </p>
              <p>
                <strong>Bank Name:</strong> {BANK_DETAILS.bankName}
              </p>
              <p>
                <strong>Amount:</strong> {formatNaira(donationData.amount)}
              </p>
            </div>
            <p className="mt-2 text-xs text-yellow-600">
              Please complete your transfer and send proof of payment to
              contact@aacfoundation.org
            </p>
          </div>
        )}
        <p className="text-sm text-green-600">
          A confirmation email has been sent to {donationData.email}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Return to Homepage
            </Button>
          </Link>
          <Button
            onClick={handleMakeAnotherDonation}
            className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
          >
            Make Another Donation
          </Button>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    const selectedMethod = getSelectedPaymentMethod();
    const amountValue =
      parseFloat(formData.amount) || parseFloat(formData.customAmount);

    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">
            Review Your Donation
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Amount:</strong> {formatNaira(amountValue)}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedMethod?.name}
            </p>
            {formData.message && (
              <p>
                <strong>Message:</strong> {formData.message}
              </p>
            )}
          </div>
        </div>

        {formData.paymentMethod === "card" && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="mb-4 flex items-center">
              <selectedMethod.icon className="mr-2 h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedMethod?.name}
              </h3>
              {!scriptLoaded && (
                <div className="ml-auto flex items-center text-sm text-yellow-600">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
                  Loading payment system...
                </div>
              )}
            </div>
            <p className="mb-4 text-sm text-gray-600">
              You will be redirected to Paystack's secure payment gateway to
              complete your donation.
            </p>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="mb-2 font-semibold text-green-800">
                Secure Payment
              </h4>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We use
                Paystack, a trusted payment processor in Nigeria.
              </p>
            </div>
          </div>
        )}

        {formData.paymentMethod === "bank" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <div className="mb-4 flex items-center">
              <selectedMethod.icon className="mr-2 h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">
                {selectedMethod?.name}
              </h3>
            </div>
            <div className="rounded-lg border border-yellow-300 bg-white p-4">
              <h4 className="mb-3 font-semibold text-gray-800">
                Bank Transfer Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Account Name:
                  </span>
                  <span className="text-gray-900">
                    {BANK_DETAILS.accountName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Account Number:
                  </span>
                  <span className="font-mono text-gray-900">
                    {BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Bank Name:</span>
                  <span className="text-gray-900">{BANK_DETAILS.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Amount:</span>
                  <span className="font-semibold text-gray-900">
                    {formatNaira(amountValue)}
                  </span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  <strong>Important:</strong> Please use your email as reference
                  and send proof of payment to contact@aacfoundation.org
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPaymentForm(false)}
            className="flex-1"
          >
            Back
          </Button>

          <Button
            type="button"
            onClick={handlePaymentSubmit}
            disabled={
              isSubmitting ||
              (formData.paymentMethod === "card" && !scriptLoaded)
            }
            className="flex-1 bg-orange-500 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              "Processing..."
            ) : formData.paymentMethod === "card" && !scriptLoaded ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Loading...
              </>
            ) : formData.paymentMethod === "card" ? (
              <>
                <selectedMethod.icon className="mr-2 h-5 w-5" />
                Pay {formatNaira(amountValue)}
              </>
            ) : (
              <>
                <selectedMethod.icon className="mr-2 h-5 w-5" />
                Complete Donation
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium text-gray-700">
          Select Donation Amount (₦) *
        </label>
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {PREDEFINED_AMOUNTS.map((amount) => (
            <button
              key={amount.value}
              type="button"
              onClick={() => handleAmountSelect(amount.value)}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                formData.amount === amount.value.toString()
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-300 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div className="font-semibold">{amount.label}</div>
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="customAmount"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Or Enter Custom Amount (₦)
          </label>
          <input
            type="number"
            id="customAmount"
            name="customAmount"
            value={formData.customAmount}
            onChange={handleCustomAmountChange}
            min="100"
            step="100"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            placeholder="Enter custom amount"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium text-gray-700">
          Select Payment Method *
        </label>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                formData.paymentMethod === method.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.paymentMethod === method.id}
                onChange={handleChange}
                className="sr-only"
              />
              <method.icon className="mr-3 h-6 w-6 text-orange-500" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{method.name}</div>
                <div className="text-sm text-gray-600">
                  {method.description}
                </div>
              </div>
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  formData.paymentMethod === method.id
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300"
                }`}
              >
                {formData.paymentMethod === method.id && (
                  <div className="m-0.5 h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          placeholder="Share your thoughts or leave a message..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 py-3 text-lg text-white hover:bg-orange-600"
      >
        {isSubmitting ? (
          "Processing..."
        ) : (
          <>
            <Heart className="mr-2 h-5 w-5" />
            Continue to Payment
          </>
        )}
      </Button>
    </form>
  );
}
