# Email Notification Setup Guide

## 🎯 Overview

This guide explains how to set up email notifications for critical performance alerts in your AACF application.

## ✅ Prerequisites

- Gmail account (or other SMTP-compatible email service)
- Admin access to your application
- Access to `.env` file

## 📧 Gmail SMTP Setup (Recommended)

### Step 1: Enable 2-Step Verification

1. Go to [myaccount.google.com](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Find **2-Step Verification** and click it
4. Follow the prompts to enable 2-Step Verification
5. **Important:** You must complete this before generating app passwords

### Step 2: Generate App Password

1. Stay in **Security** settings
2. Scroll to **2-Step Verification** section
3. At the bottom, find **App passwords**
4. Click **App passwords** (you may need to re-enter your password)
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Enter a name like "AACF Performance Alerts"
8. Click **Generate**
9. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
10. **Important:** Save this password immediately - you won't see it again!

### Step 3: Configure Environment Variables

Edit your `.env` file and add:

```bash
# Email Configuration (Gmail SMTP)
EMAIL_SMTP_USER="your-email@gmail.com"
EMAIL_SMTP_PASS="xxxx xxxx xxxx xxxx"  # The 16-char app password from Step 2
EMAIL_FROM="your-email@gmail.com"      # Same as SMTP_USER

# Admin Alert Email (who receives critical alerts)
ADMIN_ALERT_EMAIL="admin@yourdomain.com"

# Application URL (used for links in emails)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # or http://localhost:3000 for dev
```

### Step 4: Restart Your Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🧪 Testing Email Notifications

### Method 1: Use Test Script

Run the automated test script:

```bash
npx tsx scripts/test-alert-emails.ts
```

**Expected output:**

```
🧪 Testing Performance Alert Email Notifications
============================================================

1️⃣  Testing Critical Slow Query Alert...
✅ Triggered slow query alert (250ms)
✅ Critical alert email sent for slow_query

2️⃣  Testing Critical Slow API Alert...
✅ Triggered slow API alert (1200ms)
✅ Critical alert email sent for slow_api

...

📧 Check your email inbox for critical alert notifications!
```

### Method 2: Manual Testing

1. **Trigger a slow query in your code:**

   ```typescript
   // Add temporary test code
   await prisma.$queryRaw`SELECT pg_sleep(0.3)`;
   ```

2. **Trigger a slow API:**

   ```typescript
   // Add delay to any API route
   await new Promise((resolve) => setTimeout(resolve, 1500));
   ```

3. **Check your email** - You should receive critical alert emails within seconds

### Method 3: Via Performance Dashboard

1. Navigate to `/admin/performance`
2. Monitor the alerts section
3. When a critical alert appears, check your email

## 📨 What to Expect

### Email Subject Line

```
🚨 CRITICAL ALERT: slow_query - Jan 15, 2024, 10:30:00 AM
```

### Email Content

The email includes:

1. **Alert Header** - Color-coded by severity (red for critical)
2. **Alert Details:**
   - Alert Type (e.g., SLOW_QUERY)
   - Severity Level (INFO/WARNING/CRITICAL)
   - Timestamp
   - Detailed message
3. **Additional Details Table:**
   - Operation type
   - Affected table/endpoint
   - Duration
   - Threshold exceeded
4. **Recommended Actions:**
   - Review performance dashboard
   - Check logs
   - Investigate root cause
   - Take corrective action
5. **Quick Action Buttons:**
   - View Dashboard (direct link)
   - Check Logs (direct link)

## 🚦 Email Rate Limiting

To prevent spam, the system implements smart rate limiting:

### How It Works

- **Per Alert Type:** Each type (slow_query, slow_api, etc.) has independent rate limit
- **15-Minute Window:** Max 1 email per alert type per 15 minutes
- **Logged Skips:** Rate-limited emails are logged to console
- **Dashboard Always Shows:** All alerts appear in dashboard regardless of email

### Example Timeline

```
10:00 AM - Slow query alert → Email sent ✅
10:05 AM - Another slow query → Email skipped ⏭️ (rate limited)
10:10 AM - Slow API alert → Email sent ✅ (different type)
10:16 AM - Another slow query → Email sent ✅ (15 min passed)
```

### Checking Rate Limit Status

Console logs show rate limit status:

```
Email rate limit: Skipping email for slow_query (last sent 8 minutes ago)
```

## 👥 Multiple Admin Recipients

### Configuration

Send emails to multiple admins by comma-separating addresses:

```bash
# Single recipient
ADMIN_ALERT_EMAIL="admin@example.com"

# Multiple recipients (NO SPACES after commas)
ADMIN_ALERT_EMAIL="admin@example.com,ops@example.com,devops@example.com"

# ❌ WRONG - Has spaces
ADMIN_ALERT_EMAIL="admin@example.com, ops@example.com"  # Won't work!
```

### Verification

All recipients should receive identical emails simultaneously.

## 🔧 Troubleshooting

### Issue: Emails Not Being Sent

**Symptoms:** Test script runs but no emails arrive

**Solutions:**

1. **Verify environment variables are set:**

   ```bash
   # In your terminal/PowerShell
   echo $env:EMAIL_SMTP_USER   # Windows PowerShell
   echo $EMAIL_SMTP_USER       # Linux/Mac
   ```

2. **Check app password is correct:**

   - Must be 16 characters
   - Remove any spaces
   - Regenerate if unsure

3. **Verify 2-Step Verification is enabled:**

   - App passwords won't work without it

4. **Check console logs:**

   ```
   Gmail SMTP alert email error: Error: Invalid login
   ```

5. **Test Gmail credentials manually:**

   ```bash
   # Install mailtest
   npm install -g mailtest

   # Test connection
   mailtest --host smtp.gmail.com --port 587 \
            --user your-email@gmail.com \
            --pass "your-app-password"
   ```

### Issue: Emails Going to Spam

**Solutions:**

1. **Add sender to contacts:**

   - Open one email
   - Add sender's email to your contacts

2. **Mark as Not Spam:**

   - Find email in spam folder
   - Click "Not Spam" or "Report Not Spam"

3. **Whitelist the domain:**

   - Add your sending email's domain to safe senders list

4. **Check SPF/DKIM** (if using custom domain):
   - Verify DNS records are configured correctly

### Issue: HTML Not Rendering

**Symptoms:** Email shows plain text or broken formatting

**Solutions:**

1. **Enable HTML in email client:**

   - Gmail: Settings → General → Show images
   - Outlook: Trust HTML emails from sender

2. **Check email client support:**
   - Most modern clients support HTML
   - Plain text fallback included

### Issue: Links Not Working

**Symptoms:** Dashboard/Logs buttons don't work

**Solutions:**

1. **Verify NEXT_PUBLIC_APP_URL:**

   ```bash
   # Should be your actual domain
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"

   # NOT localhost in production
   ```

2. **Check link format:**
   - Links should be absolute URLs
   - Start with `https://` or `http://`

### Issue: Rate Limiting Too Aggressive

**Symptoms:** Missing important alerts

**Solutions:**

1. **Adjust rate limit window** (requires code change):

   ```typescript
   // In src/lib/alerts.ts
   private readonly emailRateLimitMs = 10 * 60 * 1000; // Change to 10 minutes
   ```

2. **Disable rate limiting** (not recommended):

   ```typescript
   // In createAlert method, comment out rate limit check
   // if (now - lastSent < this.emailRateLimitMs) { return; }
   ```

3. **Monitor dashboard instead:**
   - All alerts appear immediately in dashboard
   - No rate limiting on dashboard display

## 🌐 Alternative Email Services

### Using SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Modify `src/lib/email.ts`:
   ```typescript
   // Replace createTransporter with SendGrid client
   import sgMail from "@sendgrid/mail";
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   ```

### Using AWS SES

1. Enable AWS SES in your AWS account
2. Verify sender email
3. Update transporter:
   ```typescript
   const transporter = nodemailer.createTransport({
     host: "email-smtp.us-east-1.amazonaws.com",
     port: 587,
     auth: {
       user: process.env.AWS_SES_USER,
       pass: process.env.AWS_SES_PASS,
     },
   });
   ```

### Using Resend

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Install SDK: `npm install resend`
4. Update email sending code

## 📊 Best Practices

### 1. Test in Development First

Always test email notifications in development before production:

```bash
# .env.local (development)
EMAIL_SMTP_USER="dev-alerts@yourdomain.com"
ADMIN_ALERT_EMAIL="your-personal-email@gmail.com"
```

### 2. Use Dedicated Email Account

Create a dedicated email for sending alerts:

```
alerts@yourdomain.com
no-reply@yourdomain.com
system-alerts@yourdomain.com
```

### 3. Monitor Email Delivery

- Check email delivery success rate
- Monitor bounce rates
- Track open rates (if using email service with analytics)

### 4. Set Up Email Filters

Create filters in your email client:

```
From: alerts@yourdomain.com
Subject: CRITICAL ALERT
→ Label: Critical Alerts
→ Star
→ Never send to Spam
```

### 5. Configure On-Call Rotation

For teams, use multiple admin emails:

```bash
# Team rotation
ADMIN_ALERT_EMAIL="oncall-week1@example.com,oncall-week2@example.com,team-lead@example.com"
```

## 📋 Checklist

Use this checklist to verify your setup:

- [ ] Gmail 2-Step Verification enabled
- [ ] App password generated (16 characters)
- [ ] `.env` file updated with email credentials
- [ ] `ADMIN_ALERT_EMAIL` configured
- [ ] `NEXT_PUBLIC_APP_URL` set correctly
- [ ] Application restarted after env changes
- [ ] Test script executed (`npx tsx scripts/test-alert-emails.ts`)
- [ ] Test email received in inbox
- [ ] Email HTML renders correctly
- [ ] Dashboard and Logs buttons work
- [ ] Added sender to contacts (prevents spam)
- [ ] Configured email filters for alerts
- [ ] Documented credentials securely
- [ ] Tested with multiple recipients (if applicable)
- [ ] Verified rate limiting works (run test twice)

## 🆘 Getting Help

If you're still having issues:

1. **Check logs:**

   ```bash
   # View recent logs
   tail -f logs/app.log

   # Search for email errors
   grep -i "email" logs/app.log
   ```

2. **Enable debug mode:**

   ```typescript
   // In src/lib/email.ts
   const transporter = createTransporter({
     debug: true,
     logger: true,
   });
   ```

3. **Test SMTP connection:**

   ```bash
   telnet smtp.gmail.com 587
   ```

4. **Review documentation:**
   - `docs/PERFORMANCE_ALERTS.md` - Full alert system docs
   - `PERFORMANCE_ALERTS_IMPLEMENTATION.md` - Implementation details

## 🎉 Success!

Once configured, you'll receive beautiful, actionable email notifications for all critical performance issues. The system will help you:

- ✅ Catch performance problems immediately
- ✅ Respond to issues before users complain
- ✅ Maintain high application performance
- ✅ Keep your team informed 24/7

Happy monitoring! 📊📧

---

**Last Updated:** October 2025  
**Version:** 1.0.0
