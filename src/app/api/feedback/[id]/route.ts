import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/feedback/[id] - Update feedback status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify admin session
    const session = await verifySessionToken(request);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["new", "read", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: new, read, or resolved" },
        { status: 400 },
      );
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Feedback update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/feedback/[id] - Delete feedback (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify admin session
    const session = await verifySessionToken(request);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Feedback deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
