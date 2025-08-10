"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Heart,
  Mail,
  User,
  MessageSquare,
  CreditCard,
  Building2,
  Upload,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  loadPaystackScript,
  generateReference,
  formatAmount,
  isValidEmail,
  isValidAmount,
} from "@/lib/paystack";

interface DonationFormData {
  name: string;
  email: string;
  message: string;
  amount: string;
  customAmount: string;
  paymentMethod: "paystack" | "bank";
}

export default function DonatePage() {
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    message: "",
    amount: "",
    customAmount: "",
    paymentMethod: "paystack",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { addToast, ToastContainer } = useToast();

  const presetAmounts = ["1000", "5000", "10000", "25000", "50000"];

  useEffect(() => {
    loadPaystackScript()
      .then(() => setScriptLoaded(true))
      .catch((error) =>
        console.error("Failed to load Paystack script:", error),
      );
  }, []);

  const handleAmountSelect = (amount: string) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount,
      customAmount: "",
    }));
  };

  const handleCustomAmountChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      customAmount: value,
      amount: "",
    }));
  };

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalAmount = formData.amount || formData.customAmount;
      const amountNum = parseInt(finalAmount);

      // Validation
      if (!isValidEmail(formData.email)) {
        addToast("Please enter a valid email address.", "error");
        setIsSubmitting(false);
        return;
      }

      if (!isValidAmount(amountNum)) {
        addToast(
          "Please enter a valid donation amount (₦100 - ₦10,000,000).",
          "error",
        );
        setIsSubmitting(false);
        return;
      }

      if (formData.paymentMethod === "paystack") {
        if (!scriptLoaded) {
          addToast(
            "Payment system is still loading. Please wait a moment and try again.",
            "error",
          );
          setIsSubmitting(false);
          return;
        }

        // Initialize Paystack payment
        const handler = (window as any).PaystackPop.setup({
          key:
            process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
            "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
          email: formData.email,
          amount: formatAmount(amountNum),
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
            // Payment successful
            setShowConfirmation(true);
            addToast(
              "Donation successful! Thank you for your generosity.",
              "success",
            );
            // Here you would typically save the donation to your database
            console.log("Payment successful:", response);
          },
          onClose: function () {
            setIsSubmitting(false);
          },
        });

        handler.openIframe();
      } else {
        // Bank transfer - show confirmation and handle receipt upload
        setShowConfirmation(true);
        addToast(
          "Bank transfer details displayed. Please complete your transfer.",
          "info",
        );
        // Here you would typically handle the receipt upload and save donation details
        console.log("Bank transfer donation:", {
          ...formData,
          amount: finalAmount,
          receiptFile,
        });
      }
    } catch (error) {
      console.error("Donation error:", error);
      addToast("An error occurred. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const getFinalAmount = () => {
    return formData.amount || formData.customAmount;
  };

  // Bank Details and Charity Info
  const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "[Your Bank Name]";
  const ACCOUNT_NAME =
    process.env.NEXT_PUBLIC_ACCOUNT_NAME || "[Your Account Name]";
  const ACCOUNT_NUMBER =
    process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || "[Your Account Number]";
  const CHARITY_NAME =
    process.env.NEXT_PUBLIC_CHARITY_NAME || "[Your Charity Name]";

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Thank You for Your Donation!
          </h2>
          <p className="mb-6 text-gray-600">
            Your generous donation of ₦
            {parseInt(getFinalAmount()).toLocaleString()} will help{" "}
            {CHARITY_NAME} continue our mission.
          </p>
          {formData.paymentMethod === "bank" && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Please upload your payment receipt or send it to our email to
                complete your donation.
              </p>
            </div>
          )}
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                Return to Homepage
              </Button>
            </Link>
            <Link href="/donate">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setFormData({
                    name: "",
                    email: "",
                    message: "",
                    amount: "",
                    customAmount: "",
                    paymentMethod: "paystack",
                  });
                }}
                className="w-full"
              >
                Make Another Donation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <Heart className="h-16 w-16 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Support Our Mission
          </h1>
          <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
            Your generous donation helps us create lasting change in communities
            across Nigeria. Together, we can transform lives and build a
            brighter future for those in need.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Donation Amount Section */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Choose Your Donation Amount
                  </h2>

                  {/* Preset Amounts */}
                  <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`rounded-lg border-2 px-4 py-3 transition-all ${
                          formData.amount === amount
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        ₦{parseInt(amount).toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Or enter custom amount (₦)
                    </label>
                    <input
                      type="number"
                      value={formData.customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Your Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Message (Optional)
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Share why you're supporting our cause (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <label className="flex cursor-pointer items-center rounded-lg border border-gray-300 p-4 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paystack"
                        checked={formData.paymentMethod === "paystack"}
                        onChange={(e) =>
                          handleInputChange(
                            "paymentMethod",
                            e.target.value as "paystack" | "bank",
                          )
                        }
                        className="mr-3"
                      />
                      <CreditCard className="mr-3 h-6 w-6 text-orange-500" />
                      <div>
                        <div className="font-medium">Pay with Card</div>
                        <div className="text-sm text-gray-600">
                          Secure online payment via Paystack
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center rounded-lg border border-gray-300 p-4 hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={(e) =>
                          handleInputChange(
                            "paymentMethod",
                            e.target.value as "paystack" | "bank",
                          )
                        }
                        className="mr-3"
                      />
                      <Building2 className="mr-3 h-6 w-6 text-orange-500" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-600">
                          Direct bank deposit
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Bank Details */}
                  {formData.paymentMethod === "bank" && (
                    <div className="mt-6 rounded-lg bg-gray-50 p-6">
                      <h3 className="mb-4 font-semibold text-gray-900">
                        Bank Account Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="font-medium">{BANK_NAME}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Name:</span>
                          <span className="font-medium">{ACCOUNT_NAME}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-medium">{ACCOUNT_NUMBER}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Upload Payment Receipt (Optional)
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            <Upload className="mr-2 h-5 w-5 text-gray-400" />
                            <span className="text-sm">Choose File</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          {receiptFile && (
                            <span className="text-sm text-gray-600">
                              {receiptFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !getFinalAmount() ||
                      !formData.name ||
                      !formData.email
                    }
                    className="w-full bg-orange-500 py-4 text-lg font-semibold text-white hover:bg-orange-600"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      `Donate ₦${getFinalAmount() ? parseInt(getFinalAmount()).toLocaleString() : "0"}`
                    )}
                  </Button>
                </div>

                {/* Security Note */}
                <div className="text-center text-sm text-gray-600">
                  <p>
                    Your donation is secure and tax-deductible. We respect your
                    privacy and will never share your information.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Your Impact
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              See how your donation makes a difference in the lives of those we
              serve
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">
                5,000+
              </div>
              <div className="text-gray-700">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">50+</div>
              <div className="text-gray-700">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">
                ₦50M+
              </div>
              <div className="text-gray-700">Funds Raised</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
