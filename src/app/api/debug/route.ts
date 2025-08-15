import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    // Check database connection
    await prisma.$connect();

    // Check if any users exist
    const userCount = await prisma.user.count();

    // Check environment variables
    const envCheck = {
      SESSION_SECRET: !!process.env.SESSION_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Debug check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Only allow this in development or when explicitly enabled
export async function POST(request: Request) {
  // Simple admin creation endpoint for emergency access
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.ALLOW_ADMIN_CREATION
  ) {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 },
    );
  }

  try {
    const { email = "admin@aacf.org", password = "admin123" } =
      await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Admin user created",
      email: user.email,
      id: user.id,
    });
  } catch (error) {
    console.error("Admin creation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create admin",
      },
      { status: 500 },
    );
  }
}
