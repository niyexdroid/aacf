import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcrypt";

// Normalize & validate
const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(1)
    .transform((v) => v.trim()),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[login] Starting login attempt...");
    
    const body = await request.json();
    console.log("[login] Request body received");
    
    const { email, password } = loginSchema.parse(body);
    console.log("[login] Schema validation passed for email:", email);

    // Check database connection
    try {
      await prisma.$connect();
      console.log("[login] Database connection successful");
    } catch (dbError) {
      console.error("[login] Database connection failed:", dbError);
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("[login] User lookup result:", !!user ? "found" : "not found");

    if (!user) {
      console.log("[login] User not found for email:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("[login] Comparing passwords...");
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("[login] Password comparison result:", isPasswordValid);
    } catch (e) {
      console.error("[login] bcrypt.compare failed:", e);
      return NextResponse.json(
        { message: "Password verification failed" },
        { status: 500 },
      );
    }

    if (!isPasswordValid) {
      console.log("[login] Invalid password for user:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    try {
      await createSession(user.id);
      console.log("[login] Session created successfully for user:", user.id);
    } catch (sessionError) {
      console.error("[login] Session creation failed:", sessionError);
      return NextResponse.json(
        { message: "Session creation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ 
      message: "Logged in successfully",
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[login] Validation error:", error.errors);
      return NextResponse.json(
        { message: "Invalid request body", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("[login] Unexpected error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
