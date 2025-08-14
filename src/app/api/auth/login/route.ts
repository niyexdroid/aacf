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
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("[login] incoming email=", email, " user?", !!user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("[login] stored hash=", user.password);
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (e) {
      console.error("[login] bcrypt.compare failed", e);
    }
    console.log("[login] password valid?", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    await createSession(user.id);
    console.log("[login] session cookie set for user", user.id);
    return NextResponse.json({ message: "Logged in successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request body", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("[login] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
