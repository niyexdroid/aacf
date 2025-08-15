import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST() {
  try {
    // Check if any admin user already exists
    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
      return NextResponse.json({
        message: "Admin user already exists",
        email: existingUser.email,
      });
    }

    // Create the admin user with default credentials
    const email = "admin@aacf.org";
    const password = "admin123"; // Change this immediately after login
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      email: adminUser.email,
      note: "Please change the default password immediately after login",
    });
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
