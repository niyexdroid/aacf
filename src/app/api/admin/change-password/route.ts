import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 },
      );
    }

    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
