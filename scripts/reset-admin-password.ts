import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("🔐 Admin Password Reset Tool\n");

  // Check existing users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log("❌ No users found in database.\n");
    console.log("Creating a new admin user...\n");

    const email = await question(
      "Enter admin email (default: admin@aacf.org): ",
    );
    const password = await question("Enter new password: ");

    const finalEmail = email.trim() || "admin@aacf.org";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: finalEmail,
        password: hashedPassword,
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(
      "\n⚠️  Please save these credentials and delete this script after use.\n",
    );
  } else {
    console.log("👥 Existing users:\n");
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.email} (Created: ${user.createdAt.toLocaleDateString()})`,
      );
    });

    console.log("\nOptions:");
    console.log("1. Reset password for existing user");
    console.log("2. Create new admin user");
    console.log("3. Exit\n");

    const choice = await question("Enter your choice (1-3): ");

    if (choice === "1") {
      const emailToReset = await question("\nEnter email address to reset: ");
      const user = users.find((u) => u.email === emailToReset.trim());

      if (!user) {
        console.log("❌ User not found!");
        rl.close();
        return;
      }

      const newPassword = await question("Enter new password: ");
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log("\n✅ Password reset successfully!");
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 New Password: ${newPassword}`);
      console.log("\n⚠️  Please save these credentials.\n");
    } else if (choice === "2") {
      const email = await question("\nEnter new admin email: ");
      const password = await question("Enter password: ");

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const newUser = await prisma.user.create({
          data: {
            email: email.trim(),
            password: hashedPassword,
          },
        });

        console.log("\n✅ New admin user created successfully!");
        console.log(`📧 Email: ${newUser.email}`);
        console.log(`🔑 Password: ${password}`);
        console.log("\n⚠️  Please save these credentials.\n");
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log("\n❌ Error: Email already exists!");
        } else {
          console.log("\n❌ Error creating user:", error.message);
        }
      }
    } else {
      console.log("\nExiting...");
    }
  }

  rl.close();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  rl.close();
  prisma.$disconnect();
  process.exit(1);
});
