# 🚨 Email Authentication Issue - Action Required

## Problem Detected

Your email notification system is configured but the **Gmail App Password is invalid**.

Error: `535-5.7.8 Username and Password not accepted`

## ✅ Solution: Generate New Gmail App Password

### Step 1: Verify 2-Step Verification is Enabled

1. Go to: https://myaccount.google.com/security
2. Look for "2-Step Verification"
3. If it says "Off", click it and follow the prompts to enable it
4. **You MUST complete this step before continuing**

### Step 2: Generate New App Password

1. Go to: https://myaccount.google.com/apppasswords
   (Or Google Account → Security → 2-Step Verification → App passwords)

2. Click "**Select app**" dropdown → Choose "**Mail**"

3. Click "**Select device**" dropdown → Choose "**Other (Custom name)**"

4. Enter a name: "**AACF Performance Alerts**"

5. Click "**Generate**"

6. **COPY THE 16-CHARACTER PASSWORD** (looks like: `xxxx xxxx xxxx xxxx`)
   - Remove all spaces: `xxxxxxxxxxxxxxxx`
   - Keep only the 16 characters

### Step 3: Update Your .env File

Open your `.env` file and update this line:

```bash
EMAIL_SMTP_PASS=your_new_16_character_password_here
```

**Example:**

```bash
# If Gmail shows: abcd efgh ijkl mnop
# You should enter: abcdefghijklmnop
EMAIL_SMTP_PASS=abcdefghijklmnop
```

### Step 4: Test Again

After updating .env, run:

```bash
npx tsx scripts/diagnose-email.ts
```

**Expected output:**

```
✅ SMTP connection successful!
✅ Test email sent successfully!
📧 Check your inbox: abosedeainacharityfoundation@gmail.com
```

## 📧 Current Configuration

Based on diagnostics, your settings are:

```
✅ EMAIL_SMTP_HOST: smtp.gmail.com
✅ EMAIL_SMTP_PORT: 587
✅ EMAIL_SMTP_USER: abosedeainacharityfoundation@gmail.com
❌ EMAIL_SMTP_PASS: Invalid (needs new app password)
✅ EMAIL_FROM: abosedeainacharityfoundation@gmail.com
✅ ADMIN_ALERT_EMAIL: abosedeainacharityfoundation@gmail.com
```

## ⚠️ Important Notes

1. **App Password ≠ Gmail Password**

   - Don't use your regular Gmail password
   - You MUST use a 16-character App Password

2. **2-Step Verification Required**

   - App Passwords only work with 2-Step Verification enabled
   - Enable it at: https://myaccount.google.com/security

3. **Remove Spaces**

   - Gmail shows: `abcd efgh ijkl mnop`
   - You enter: `abcdefghijklmnop`

4. **One-Time View**
   - You can only see the App Password once
   - If you lose it, generate a new one

## 🧪 Testing Checklist

After updating the password:

- [ ] Updated `EMAIL_SMTP_PASS` in `.env` file
- [ ] Removed all spaces from the password
- [ ] Password is exactly 16 characters
- [ ] 2-Step Verification is enabled
- [ ] Run `npx tsx scripts/diagnose-email.ts`
- [ ] SMTP connection test passes
- [ ] Test email received in inbox
- [ ] Check spam folder if not in inbox

## 🆘 Still Having Issues?

### If 2-Step Verification can't be enabled:

**Option 1: Allow Less Secure Apps** (Not recommended)

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Update .env to use your regular Gmail password

**Option 2: Use a Different Email Service**

- SendGrid (free tier: 100 emails/day)
- AWS SES (free tier: 62,000 emails/month)
- Mailgun (free tier: 5,000 emails/month)

### If App Password still doesn't work:

1. **Delete old app passwords:**

   - Go to App Passwords page
   - Remove any old "AACF" or "Mail" passwords
   - Generate a fresh one

2. **Try a different browser:**

   - Use Chrome Incognito mode
   - Clear browser cache

3. **Check account restrictions:**
   - Some Google Workspace accounts restrict app passwords
   - Contact your Google admin if using a work account

## 📞 Quick Help Commands

```bash
# Test email configuration
npx tsx scripts/diagnose-email.ts

# View current .env settings (masked passwords)
grep EMAIL .env

# Test full alert system (once emails work)
npx tsx scripts/test-alert-emails.ts
```

## 🎯 Success Criteria

You'll know it's working when you see:

```
✅ Loaded .env file
✅ SMTP connection successful!
✅ Test email sent successfully!
📬 Message ID: <...>
📧 Sent to: abosedeainacharityfoundation@gmail.com

🎉 All Tests Passed!
```

---

**Need More Help?**

See full documentation: `docs/EMAIL_NOTIFICATION_SETUP.md`

**Generated:** ${new Date().toISOString()}
