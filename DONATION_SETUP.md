# Donation System Setup Guide

This guide will help you configure the donation system for your charity website.

## 🚀 Quick Setup

### 1. Environment Configuration

Copy the example environment file and add your actual credentials:

```bash
cp .env.local.example .env.local
```

Add your actual values to `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_actual_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_actual_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_actual_paystack_public_key
PAYSTACK_SECRET_KEY=your_actual_paystack_secret_key

# Bank Details (for bank transfer option)
NEXT_PUBLIC_BANK_NAME=Your Actual Bank Name
NEXT_PUBLIC_ACCOUNT_NAME=Your Actual Account Name
NEXT_PUBLIC_ACCOUNT_NUMBER=1234567890

# Charity Information
NEXT_PUBLIC_CHARITY_NAME=Your Actual Charity Name
CHARITY_EMAIL=contact@yourcharity.org
CHARITY_PHONE=+234 123 456 7890
```

### 2. Paystack Setup

1. **Create a Paystack Account:**

   - Go to [Paystack](https://paystack.com)
   - Sign up for a business account
   - Complete the verification process

2. **Get Your API Keys:**

   - Navigate to Settings → API Keys & Webhooks
   - Copy your **Public Key** and **Secret Key**
   - Add them to your `.env.local` file

3. **Configure Webhook:**
   - In Paystack dashboard, go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/donate/webhook`
   - Select events: `charge.success`, `transfer.failed`
   - Save the webhook

### 3. Firebase Setup

1. **Firestore Configuration:**

   - Go to Firebase Console
   - Select your project
   - Create a Firestore database
   - Start in test mode (you can secure it later)

2. **Security Rules (Optional but Recommended):**

   - Add these rules to Firestore:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /donations/{docId} {
         allow read, create: if true;
         allow update, delete: if false;
       }
     }
   }
   ```

### 4. Email Service Setup (Optional)

To send automated thank-you emails, choose one of these options:

#### Option A: Resend (Recommended)

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add to `.env.local`: `EMAIL_SERVICE_API_KEY=your_resend_api_key`
4. Install: `npm install resend`

#### Option B: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`: `EMAIL_SERVICE_API_KEY=your_sendgrid_api_key`
4. Install: `npm install @sendgrid/mail`

#### Option C: Nodemailer with SMTP

1. Use your existing email service (Gmail, Outlook, etc.)
2. Configure SMTP settings in `.env.local`
3. Install: `npm install nodemailer`

## 📱 Testing the Donation System

### 1. Test Paystack Integration

- Go to `/donate`
- Select an amount and fill in donor information
- Choose "Pay with Card"
- Use Paystack test card: `4084084084084081` with any future date and CVV

### 2. Test Bank Transfer

- Choose "Bank Transfer" option
- Verify bank details are displayed correctly
- Test receipt upload functionality

### 3. Test Webhook

- Use Paystack's test webhook feature
- Verify donations are saved to Firestore
- Check email notifications (if configured)

## 🔧 Customization

### Brand Colors and Styling

The donation page uses your brand colors (orange theme). To customize:

- Edit `src/app/donate/page.tsx`
- Modify the CSS classes and color values

### Charity Information

Update these sections in the donation page:

- Hero section mission statement
- Impact statistics
- Bank details (via environment variables)

### Email Templates

Customize email templates in `src/lib/email.ts`:

- `generateThankYouEmail()` - Thank you message
- `generateReceiptEmail()` - Donation receipt
- Update charity name and contact information

## 🚀 Deployment

### 1. Environment Variables on Vercel

If deploying to Vercel:

1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add all variables from `.env.local`

### 2. Webhook URL

Update your Paystack webhook URL to your production domain:
`https://your-production-domain.com/api/donate/webhook`

### 3. Domain Configuration

- Ensure your domain is properly configured
- SSL certificate is active
- Firebase domain is whitelisted

## 📊 Monitoring

### 1. Paystack Dashboard

- Monitor successful transactions
- Track failed payments
- View settlement reports

### 2. Firebase Console

- Monitor donation data
- Check webhook logs
- Track database usage

### 3. Email Service Dashboard

- Monitor email delivery rates
- Track bounce rates
- View email analytics

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env.local` to version control
2. **Webhook Security:** Always verify Paystack signatures
3. **Data Validation:** Validate all user inputs
4. **Rate Limiting:** Implement rate limiting for donation endpoints
5. **HTTPS:** Ensure your site uses HTTPS

## 📞 Support

If you encounter any issues:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure Paystack webhook is properly configured
4. Check Firebase security rules

## 🎉 Success!

Your donation system is now ready! Donors can:

- Make secure online payments via Paystack
- Transfer directly to your bank account
- Receive automatic thank-you emails
- Get donation receipts for tax purposes

The system is fully responsive and works on all devices.
