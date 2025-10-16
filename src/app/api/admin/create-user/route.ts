import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";

const createUserSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, password } = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 },
      );
    }

    console.error("Create user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
