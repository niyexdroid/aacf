#!/usr/bin/env tsx

/**
 * Email Configuration Diagnostic Script
 *
 * This script tests your email configuration and helps identify issues
 */

// Load environment variables from .env file
import dotenv from "dotenv";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log("⚠️  Warning: Could not load .env file from:", envPath);
  console.log("   Using environment variables from shell/system\n");
} else {
  console.log("✅ Loaded .env file from:", envPath, "\n");
}

console.log("🔍 Email Configuration Diagnostic\n");
console.log("=".repeat(60));

// Check environment variables
console.log("\n📋 Step 1: Checking Environment Variables...\n");

const requiredVars = [
  "EMAIL_SMTP_HOST",
  "EMAIL_SMTP_PORT",
  "EMAIL_SMTP_USER",
  "EMAIL_SMTP_PASS",
  "EMAIL_FROM",
  "ADMIN_ALERT_EMAIL",
];

const optionalVars = ["NEXT_PUBLIC_APP_URL"];

let allConfigured = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive data
    const displayValue = varName.includes("PASS")
      ? "****" + value.slice(-4)
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allConfigured = false;
  }
});

console.log("\nOptional Variables:");
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (will use default)`);
  }
});

if (!allConfigured) {
  console.log("\n❌ ERROR: Some required environment variables are missing!");
  console.log("\n💡 To fix this:");
  console.log("1. Copy .env.example to .env");
  console.log("2. Fill in your Gmail credentials");
  console.log("3. Restart the application\n");
  process.exit(1);
}

console.log("\n" + "=".repeat(60));
console.log("\n📧 Step 2: Testing SMTP Connection...\n");

// Test SMTP connection
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: parseInt(process.env.EMAIL_SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

try {
  console.log("Attempting to connect to SMTP server...");
  await transporter.verify();
  console.log("✅ SMTP connection successful!\n");
} catch (error: any) {
  console.log("❌ SMTP connection failed!\n");
  console.error("Error:", error.message);

  if (error.message.includes("Invalid login")) {
    console.log("\n💡 Possible solutions:");
    console.log("1. Verify your EMAIL_SMTP_USER is correct");
    console.log("2. Check your EMAIL_SMTP_PASS is a valid Gmail App Password");
    console.log("3. Make sure 2-Step Verification is enabled in Gmail");
    console.log("4. Generate a new App Password if needed\n");
  }

  process.exit(1);
}

console.log("=".repeat(60));
console.log("\n📨 Step 3: Sending Test Email...\n");

const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.EMAIL_FROM;

try {
  const result = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: "🧪 Test Email - AACF Performance Alert System",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Test Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 25px; background: #10b981; border-radius: 10px;">
          <h1 style="color: white; margin: 0;">✅ Email Configuration Working!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; border: 2px solid #10b981;">
          <h2 style="color: #059669; margin-top: 0;">Test Successful</h2>
          <p>If you're reading this, your email notification system is configured correctly!</p>
          
          <h3 style="color: #059669;">Configuration Details:</h3>
          <ul>
            <li><strong>SMTP Host:</strong> ${process.env.EMAIL_SMTP_HOST}</li>
            <li><strong>SMTP Port:</strong> ${process.env.EMAIL_SMTP_PORT}</li>
            <li><strong>From:</strong> ${process.env.EMAIL_FROM}</li>
            <li><strong>To:</strong> ${adminEmail}</li>
            <li><strong>App URL:</strong> ${process.env.NEXT_PUBLIC_APP_URL || "Not set"}</li>
          </ul>
          
          <h3 style="color: #059669;">Next Steps:</h3>
          <ol>
            <li>Test the full alert system: <code>npx tsx scripts/test-alert-emails.ts</code></li>
            <li>Trigger a critical alert to see real email notifications</li>
            <li>Configure email filters to auto-label critical alerts</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            AACF Performance Monitoring System<br>
            Email Configuration Test
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
✅ EMAIL CONFIGURATION WORKING!

If you're reading this, your email notification system is configured correctly!

Configuration Details:
- SMTP Host: ${process.env.EMAIL_SMTP_HOST}
- SMTP Port: ${process.env.EMAIL_SMTP_PORT}
- From: ${process.env.EMAIL_FROM}
- To: ${adminEmail}
- App URL: ${process.env.NEXT_PUBLIC_APP_URL || "Not set"}

Next Steps:
1. Test the full alert system: npx tsx scripts/test-alert-emails.ts
2. Trigger a critical alert to see real email notifications
3. Configure email filters to auto-label critical alerts

---
AACF Performance Monitoring System
Email Configuration Test
    `,
  });

  console.log("✅ Test email sent successfully!");
  console.log(`📬 Message ID: ${result.messageId}`);
  console.log(`📧 Sent to: ${adminEmail}\n`);
} catch (error: any) {
  console.log("❌ Failed to send test email!\n");
  console.error("Error:", error.message);
  process.exit(1);
}

console.log("=".repeat(60));
console.log("\n🎉 All Tests Passed!\n");
console.log("✅ Environment variables configured");
console.log("✅ SMTP connection successful");
console.log("✅ Test email sent");
console.log("\n📧 Check your inbox:", adminEmail);
console.log("\n💡 If you don't see the email:");
console.log("   1. Check your spam/junk folder");
console.log("   2. Wait a few minutes for delivery");
console.log("   3. Verify the email address is correct");
console.log("\n🚀 Ready to test alert emails:");
console.log("   npx tsx scripts/test-alert-emails.ts\n");
