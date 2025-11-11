// Email service for sending donation-related emails
import nodemailer from "nodemailer";

// Create Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SMTP_USER || process.env.EMAIL_FROM,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  reference: string;
  message?: string;
  charityName: string;
}

export const sendThankYouEmail = async (
  data: DonationEmailData,
): Promise<void> => {
  try {
    const emailData: EmailData = {
      to: data.donorEmail,
      subject: `Thank You for Your Donation to ${data.charityName}`,
      html: generateThankYouEmail(data),
      text: generateThankYouEmailText(data),
    };

    // Here you would implement the actual email sending logic
    // Options include:
    // 1. SendGrid
    // 2. Resend
    // 3. Nodemailer with SMTP
    // 4. AWS SES
    // 5. Firebase Extensions

    console.log("Sending thank-you email:", emailData);

    // Mock implementation - replace with your actual email service
    // await sendEmail(emailData);
  } catch (error) {
    console.error("Error sending thank-you email:", error);
    throw error;
  }
};

export const sendDonationReceipt = async (
  data: DonationEmailData,
): Promise<void> => {
  try {
    const emailData: EmailData = {
      to: data.donorEmail,
      subject: `Donation Receipt from ${data.charityName}`,
      html: generateReceiptEmail(data),
      text: generateReceiptEmailText(data),
    };

    console.log("Sending donation receipt:", emailData);

    // Mock implementation - replace with your actual email service
    // await sendEmail(emailData);
  } catch (error) {
    console.error("Error sending donation receipt:", error);
    throw error;
  }
};

const generateThankYouEmail = (data: DonationEmailData): string => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Your Donation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        .amount { font-size: 24px; font-weight: bold; color: #ff6b00; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You!</h1>
        </div>
        <div class="content">
          <p>Dear ${data.donorName},</p>
          <p>Thank you so much for your generous donation of <strong>${formattedAmount}</strong> to ${data.charityName}.</p>
          <p>Your support helps us continue our mission and make a real difference in the lives of those we serve.</p>
          ${data.message ? `<p><strong>Your Message:</strong> "${data.message}"</p>` : ""}
          <div class="amount">${formattedAmount}</div>
          <p><strong>Donation Reference:</strong> ${data.reference}</p>
          <p>This donation is tax-deductible. You will receive a separate receipt for your records.</p>
          <p>With heartfelt gratitude,<br>The ${data.charityName} Team</p>
        </div>
        <div class="footer">
          <p>${data.charityName}<br>
          Contact us: contact@yourcharity.org</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateThankYouEmailText = (data: DonationEmailData): string => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return `
Thank You!

Dear ${data.donorName},

Thank you so much for your generous donation of ${formattedAmount} to ${data.charityName}.

Your support helps us continue our mission and make a real difference in the lives of those we serve.
${data.message ? `Your Message: "${data.message}"` : ""}

Donation Amount: ${formattedAmount}
Donation Reference: ${data.reference}

This donation is tax-deductible. You will receive a separate receipt for your records.

With heartfelt gratitude,
The ${data.charityName} Team

${data.charityName}
Contact us: contact@yourcharity.org
  `;
};

const generateReceiptEmail = (data: DonationEmailData): string => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Donation Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #ff6b00; }
        .content { padding: 30px 0; }
        .receipt-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 28px; font-weight: bold; color: #ff6b00; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Donation Receipt</h1>
          <p>${data.charityName}</p>
        </div>
        <div class="content">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Donor:</strong> ${data.donorName}</p>
          <p><strong>Email:</strong> ${data.donorEmail}</p>
          
          <div class="receipt-details">
            <p><strong>Donation Reference:</strong> ${data.reference}</p>
            <p><strong>Amount:</strong></p>
            <div class="amount">${formattedAmount}</div>
            <p><strong>Payment Method:</strong> Online Payment</p>
            <p><strong>Status:</strong> Completed</p>
          </div>
          
          <p>This receipt serves as confirmation of your tax-deductible donation to ${data.charityName}. Thank you for your support!</p>
        </div>
        <div class="footer">
          <p>${data.charityName}<br>
          Registered Non-Profit Organization<br>
          Contact us: contact@yourcharity.org</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateReceiptEmailText = (data: DonationEmailData): string => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return `
DONATION RECEIPT

${data.charityName}
Date: ${new Date().toLocaleDateString()}

Donor Information:
Name: ${data.donorName}
Email: ${data.donorEmail}

Donation Details:
Reference: ${data.reference}
Amount: ${formattedAmount}
Payment Method: Online Payment
Status: Completed

This receipt serves as confirmation of your tax-deductible donation to ${data.charityName}. Thank you for your support!

${data.charityName}
Registered Non-Profit Organization
Contact us: contact@yourcharity.org
  `;
};

// Contact Form Email Interfaces
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactNotificationData extends ContactFormData {
  feedbackId: string;
}

// Send confirmation email to user who submitted contact form
export const sendContactConfirmationEmail = async (
  data: ContactFormData,
): Promise<void> => {
  try {
    console.log("Preparing contact confirmation email for:", data.email);

    // Send email using Gmail SMTP if credentials are available
    if (process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASS) {
      try {
        const transporter = createTransporter();
        const result = await transporter.sendMail({
          from:
            process.env.EMAIL_FROM || "abosedeainacharityfoundation@gmail.com",
          to: data.email,
          subject: `Thank you for contacting Abosede Aina Charity Foundation`,
          html: generateContactConfirmationEmail(data),
          text: generateContactConfirmationEmailText(data),
        });
        console.log("Email sent successfully:", result);
      } catch (emailError) {
        console.error("Gmail SMTP email error:", emailError);
      }
    } else {
      console.log("No Gmail SMTP credentials found, email sending skipped");
    }
  } catch (error) {
    console.error("Error sending contact confirmation email:", error);
  }
};

// Send notification email to admin about new contact form submission
export const sendContactNotificationEmail = async (
  data: ContactNotificationData,
): Promise<void> => {
  try {
    console.log("Preparing admin notification email");

    // Send email using Gmail SMTP if credentials are available
    if (process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASS) {
      try {
        const transporter = createTransporter();
        const result = await transporter.sendMail({
          from:
            process.env.EMAIL_FROM || "abosedeainacharityfoundation@gmail.com",
          to: "abosedeainacharityfoundation@gmail.com",
          subject: `New Contact Form Submission: ${data.subject}`,
          html: generateContactNotificationEmail(data),
          text: generateContactNotificationEmailText(data),
        });
        console.log("Admin notification email sent successfully:", result);
      } catch (emailError) {
        console.error("Gmail SMTP admin email error:", emailError);
      }
    } else {
      console.log(
        "No Gmail SMTP credentials found, admin notification email sending skipped",
      );
    }
  } catch (error) {
    console.error("Error sending contact notification email:", error);
  }
};

// Generate HTML for contact confirmation email
const generateContactConfirmationEmail = (data: ContactFormData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Contacting Us</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
      </div>
      
      <!-- Main Content -->
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0; font-size: 16px;">Dear ${data.name},</p>
        
        <p style="margin: 0 0 15px 0;">Thank you for contacting Abosede Aina Charity Foundation. We have received your message and appreciate you taking the time to reach out to us.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">Your Message Details:</h3>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
          <p style="margin: 5px 0;"><strong>Message:</strong></p>
          <p style="margin: 10px 0; padding: 15px; background: #f1f5f9; border-radius: 5px; font-style: italic;">${data.message}</p>
        </div>
        
        <p style="margin: 15px 0;">Our team will review your message and get back to you within 24 hours during business days.</p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e5e7eb;">
        <p style="margin: 0 0 10px 0; color: #6b7280;">Thank you for your interest in our mission!</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Abosede Aina Charity Foundation<br>
          Making a difference in communities across Nigeria
        </p>
      </div>
      
    </body>
    </html>
  `;
};

// Generate text version for contact confirmation email
const generateContactConfirmationEmailText = (
  data: ContactFormData,
): string => {
  return `
Dear ${data.name},

Thank you for contacting Abosede Aina Charity Foundation. We have received your message and appreciate you taking the time to reach out to us.

Your Message Details:
Subject: ${data.subject}
Message: ${data.message}

Our team will review your message and get back to you within 24 hours during business days.

Thank you for your interest in our mission!

Abosede Aina Charity Foundation
Making a difference in communities across Nigeria
  `;
};

// Generate HTML for contact notification email to admin
const generateContactNotificationEmail = (
  data: ContactNotificationData,
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
      </div>
      
      <!-- Main Content -->
      <div style="background: #fef2f2; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 20px 0; color: #dc2626;">Contact Details</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
          <p style="margin: 5px 0;"><strong>Feedback ID:</strong> ${data.feedbackId}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Message:</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 5px;">${data.message}</div>
        </div>
      </div>
      
    </body>
    </html>
  `;
};

// Generate text version for contact notification email
const generateContactNotificationEmailText = (
  data: ContactNotificationData,
): string => {
  return `
🔔 NEW CONTACT FORM SUBMISSION

Contact Details:
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Feedback ID: ${data.feedbackId}

Message:
${data.message}

This is an automated notification from your website contact form.
  `;
};

// Performance Alert Email Interfaces
export interface PerformanceAlertData {
  alertType: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Send critical performance alert email to admins
export const sendPerformanceAlertEmail = async (
  data: PerformanceAlertData,
): Promise<void> => {
  try {
    // Only send emails for critical alerts to avoid spam
    if (data.severity !== "critical") {
      return;
    }

    console.log("Preparing critical performance alert email");

    // Get admin email(s) from environment variable
    const adminEmails =
      process.env.ADMIN_ALERT_EMAIL ||
      process.env.EMAIL_FROM ||
      "abosedeainacharityfoundation@gmail.com";

    // Send email using Gmail SMTP if credentials are available
    if (process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASS) {
      try {
        const transporter = createTransporter();
        const result = await transporter.sendMail({
          from:
            process.env.EMAIL_FROM || "abosedeainacharityfoundation@gmail.com",
          to: adminEmails,
          subject: `🚨 CRITICAL ALERT: ${data.alertType} - ${new Date(data.timestamp).toLocaleString()}`,
          html: generatePerformanceAlertEmail(data),
          text: generatePerformanceAlertEmailText(data),
          priority: "high",
        });
        console.log(
          "Critical alert email sent successfully:",
          result.messageId,
        );
      } catch (emailError) {
        console.error("Gmail SMTP alert email error:", emailError);
      }
    } else {
      console.log(
        "No Gmail SMTP credentials found, alert email sending skipped",
      );
    }
  } catch (error) {
    console.error("Error sending performance alert email:", error);
    // Don't throw - we don't want email failures to break the app
  }
};

// Generate HTML for performance alert email
const generatePerformanceAlertEmail = (data: PerformanceAlertData): string => {
  const severityColors = {
    critical: "#dc2626",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const severityEmojis = {
    critical: "🔴",
    warning: "🟡",
    info: "🔵",
  };

  const color = severityColors[data.severity];
  const emoji = severityEmojis[data.severity];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Critical Performance Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 25px; background: ${color}; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: white; margin: 0; font-size: 28px;">${emoji} CRITICAL PERFORMANCE ALERT</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Immediate attention required</p>
      </div>
      
      <!-- Alert Details -->
      <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="margin: 0 0 20px 0; color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 10px;">Alert Details</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #4b5563;">Alert Type:</strong>
          <span style="display: inline-block; margin-left: 10px; padding: 4px 12px; background: ${color}; color: white; border-radius: 4px; font-size: 14px;">${data.alertType.toUpperCase()}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #4b5563;">Severity:</strong>
          <span style="display: inline-block; margin-left: 10px; padding: 4px 12px; background: ${color}; color: white; border-radius: 4px; font-size: 14px;">${emoji} ${data.severity.toUpperCase()}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #4b5563;">Timestamp:</strong>
          <span style="margin-left: 10px; color: #6b7280;">${new Date(data.timestamp).toLocaleString()}</span>
        </div>
        
        <div style="background: #fef2f2; border-left: 4px solid ${color}; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: ${color}; font-size: 16px;">⚠️ Alert Message</h3>
          <p style="margin: 0; color: #374151; font-size: 15px; font-weight: 500;">${data.message}</p>
        </div>
        
        ${
          data.metadata && Object.keys(data.metadata).length > 0
            ? `
        <div style="margin-top: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">📊 Additional Details</h3>
          <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
            ${Object.entries(data.metadata)
              .map(
                ([key, value]) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; font-weight: 600; color: #4b5563; width: 40%;">${key}</td>
                <td style="padding: 12px; color: #6b7280;">${JSON.stringify(value)}</td>
              </tr>
            `,
              )
              .join("")}
          </table>
        </div>
        `
            : ""
        }
      </div>
      
      <!-- Action Items -->
      <div style="background: #eff6ff; padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #3b82f6;">
        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🎯 Recommended Actions</h3>
        <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
          <li style="margin-bottom: 8px;">Review the performance dashboard at <strong>/admin/performance</strong></li>
          <li style="margin-bottom: 8px;">Check recent logs for more context</li>
          <li style="margin-bottom: 8px;">Investigate the root cause of the performance issue</li>
          <li style="margin-bottom: 8px;">Take corrective action to resolve the issue</li>
          <li style="margin-bottom: 8px;">Consider adjusting alert thresholds if needed</li>
        </ul>
      </div>
      
      <!-- Quick Links -->
      <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 15px 0; color: #374151;">Quick Actions</h3>
        <div style="display: inline-block; margin: 0 10px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/performance" 
             style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
            📊 View Dashboard
          </a>
        </div>
        <div style="display: inline-block; margin: 0 10px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/performance#logs" 
             style="display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
            📝 Check Logs
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e5e7eb;">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
          This is an automated alert from your application performance monitoring system.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          AACF Performance Monitoring System<br>
          ${new Date().toLocaleDateString()}
        </p>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text for performance alert email
const generatePerformanceAlertEmailText = (
  data: PerformanceAlertData,
): string => {
  const severityEmojis = {
    critical: "🔴",
    warning: "🟡",
    info: "🔵",
  };

  const emoji = severityEmojis[data.severity];

  return `
${emoji} CRITICAL PERFORMANCE ALERT ${emoji}

ALERT DETAILS
=============
Alert Type: ${data.alertType.toUpperCase()}
Severity: ${emoji} ${data.severity.toUpperCase()}
Timestamp: ${new Date(data.timestamp).toLocaleString()}

ALERT MESSAGE
=============
${data.message}

${
  data.metadata && Object.keys(data.metadata).length > 0
    ? `
ADDITIONAL DETAILS
==================
${Object.entries(data.metadata)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join("\n")}
`
    : ""
}

RECOMMENDED ACTIONS
===================
- Review the performance dashboard at /admin/performance
- Check recent logs for more context
- Investigate the root cause of the performance issue
- Take corrective action to resolve the issue
- Consider adjusting alert thresholds if needed

QUICK LINKS
===========
Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/performance
Logs: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/performance#logs

---
This is an automated alert from your application performance monitoring system.
AACF Performance Monitoring System
${new Date().toLocaleDateString()}
  `;
};
