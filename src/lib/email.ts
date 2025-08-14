// Email service for sending donation-related emails
import nodemailer from "nodemailer";

// Create Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
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
