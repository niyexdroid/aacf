import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent user from deleting themselves
    if (id === session.userId) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // Check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if this is the last admin user
    const userCount = await prisma.user.count();
    if (userCount <= 1) {
      return NextResponse.json(
        { message: "Cannot delete the last admin user" },
        { status: 400 },
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
