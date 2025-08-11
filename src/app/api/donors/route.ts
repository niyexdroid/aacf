import { NextResponse } from "next/server";
import { createDonor } from "@/actions/createDonor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, amount, message, paymentStatus, paymentReference } =
      body;

    const result = await createDonor({
      name,
      email,
      amount,
      message,
      paymentStatus,
      paymentReference,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        donor: result.donor,
        isUpdate: result.isUpdate,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error in donor API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while processing your request",
      },
      { status: 500 },
    );
  }
}
