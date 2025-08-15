import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst();

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const email = "admin@aacf.org";
    const password = "admin123"; // Change this to a secure password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      console.log("ℹ️  User with this email already exists");
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
