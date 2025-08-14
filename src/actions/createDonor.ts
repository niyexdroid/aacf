"use server";

import prisma from "@/lib/prisma";

export async function createDonor(donorData: {
  name: string;
  email: string;
  amount?: number;
  message?: string;
  paymentReference?: string;
  paymentStatus?: "success" | "failed" | "pending";
  paymentMethod?: "paystack" | "bank_transfer";
}) {
  try {
    const {
      name,
      email,
      amount,
      message,
      paymentReference,
      paymentStatus = "success",
      paymentMethod = "paystack",
    } = donorData;

    // Validate required fields
    if (!name || !email) {
      return {
        success: false,
        error: "Name and email are required fields",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Create donor record for successful or pending payments
    if (paymentStatus === "success" || paymentStatus === "pending") {
      // Check if email already exists
      const existingDonor = await prisma.donor.findUnique({
        where: { email },
      });

      if (existingDonor) {
        // Update existing donor with new donation info
        const updatedDonor = await prisma.donor.update({
          where: { email },
          data: {
            amount: amount
              ? (existingDonor.amount || 0) + amount
              : existingDonor.amount,
            message: message || existingDonor.message,
            paymentReference,
            paymentStatus,
            paymentMethod,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          donor: updatedDonor,
          isUpdate: true,
        };
      } else {
        // Create new donor record
        const donor = await prisma.donor.create({
          data: {
            name,
            email,
            amount,
            message,
            paymentReference,
            paymentStatus,
            paymentMethod,
          },
        });

        return {
          success: true,
          donor,
          isUpdate: false,
        };
      }
    } else {
      return {
        success: false,
        error: "Payment was not successful. Donor information not saved.",
      };
    }
  } catch (error) {
    console.error("Error creating donor:", error);
    return {
      success: false,
      error: "An error occurred while processing your donation",
    };
  }
}

export async function recordFailedPayment(donorData: {
  name: string;
  email: string;
  amount?: number;
  error: string;
}) {
  try {
    // Here you could log failed payments to a separate table or analytics service
    // For now, we'll just return the error without saving to the main donor table
    console.log(
      `Failed payment recorded for ${donorData.email}: ${donorData.error}`,
    );

    return {
      success: false,
      error: donorData.error,
    };
  } catch (error) {
    console.error("Error recording failed payment:", error);
    return {
      success: false,
      error: "An error occurred while recording the failed payment",
    };
  }
}
