import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, amount, email, name, message, paymentMethod, metadata } =
      body;

    // Validate required fields
    if (!reference || !amount || !email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save donation to Firestore
    const donationData = {
      reference,
      amount: parseInt(amount) / 100, // Convert from kobo to Naira
      email,
      donorName: name,
      message: message || "",
      paymentMethod,
      status: "completed",
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "donations"), donationData);

    // Send thank-you email (you would implement this with your email service)
    // await sendThankYouEmail(email, name, amount);

    return NextResponse.json({
      success: true,
      donationId: docRef.id,
      message: "Donation recorded successfully",
    });
  } catch (error) {
    console.error("Error saving donation:", error);
    return NextResponse.json(
      { error: "Failed to save donation" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 },
      );
    }

    // Here you would typically verify the payment with Paystack
    // and return the donation status
    // For now, we'll just return a mock response

    return NextResponse.json({
      success: true,
      reference,
      status: "completed",
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
