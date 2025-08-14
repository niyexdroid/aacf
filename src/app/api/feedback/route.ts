import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/feedback - List all feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifySessionToken(request);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Feedback list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
