import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendContactConfirmationEmail,
  sendContactNotificationEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long" },
        { status: 400 },
      );
    }

    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: "new",
      },
    });

    // Send confirmation email to user
    try {
      await sendContactConfirmationEmail({
        name,
        email,
        subject,
        message,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue even if email fails
    }

    // Send notification email to admin
    try {
      await sendContactNotificationEmail({
        name,
        email,
        subject,
        message,
        feedbackId: feedback.id,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admins to view feedback
    // For now, return a simple message
    return NextResponse.json({
      message: "Contact API is working",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
