// Email service for sending donation-related emails

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
