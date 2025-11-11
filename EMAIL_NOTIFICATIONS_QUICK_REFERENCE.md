# 📧 Email Notifications Quick Reference

## ⚡ Quick Setup (5 Minutes)

### 1. Enable Gmail App Password

```
1. Visit: myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create password for "Mail"
5. Copy 16-character password
```

### 2. Configure .env

```bash
EMAIL_SMTP_USER="your-email@gmail.com"
EMAIL_SMTP_PASS="xxxx xxxx xxxx xxxx"
EMAIL_FROM="your-email@gmail.com"
ADMIN_ALERT_EMAIL="admin@yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 3. Test

```bash
npx tsx scripts/test-alert-emails.ts
```

## 📨 What Gets Emailed?

**ONLY CRITICAL ALERTS:**

- Slow queries (>200ms)
- Slow APIs (>1000ms)
- High error rates (>10%)
- High cache misses (>70%)
- Auth failures (>10 in 5min)

## 🚦 Rate Limiting

**15-Minute Window:**

- Max 1 email per alert type per 15 minutes
- Prevents spam
- All alerts still visible in dashboard

## 🎨 Email Features

✅ Beautiful HTML design  
✅ Color-coded severity  
✅ All alert details  
✅ Quick action buttons  
✅ Mobile responsive  
✅ Plain text fallback  
✅ Multiple recipients

## 🧪 Testing

**Test Script:**

```bash
npx tsx scripts/test-alert-emails.ts
```

**Manual Test:**

```typescript
// Trigger slow query
await prisma.$queryRaw`SELECT pg_sleep(0.3)`;

// Check your email!
```

## 🔧 Troubleshooting

### No Emails?

1. Check `.env` variables set
2. Verify app password (16 chars, no spaces)
3. Enable 2-Step Verification
4. Check console logs
5. Run test script

### Emails in Spam?

1. Add sender to contacts
2. Mark as "Not Spam"
3. Create email filter

### Links Not Working?

1. Verify `NEXT_PUBLIC_APP_URL`
2. Should be full domain: `https://yourdomain.com`
3. Not `localhost` in production

## 📚 Full Documentation

- **Setup Guide:** `docs/EMAIL_NOTIFICATION_SETUP.md`
- **Alert System:** `docs/PERFORMANCE_ALERTS.md`
- **Implementation:** `EMAIL_NOTIFICATIONS_IMPLEMENTATION.md`

## 🎯 Quick Commands

```bash
# Test emails
npx tsx scripts/test-alert-emails.ts

# Check environment
echo $EMAIL_SMTP_USER

# View logs
grep -i "email" logs/*.log

# Restart app
npm run dev
```

## 📊 At a Glance

| Feature             | Status   |
| ------------------- | -------- |
| HTML Emails         | ✅       |
| Plain Text          | ✅       |
| Rate Limiting       | ✅ 15min |
| Multiple Recipients | ✅       |
| Mobile Responsive   | ✅       |
| Quick Actions       | ✅       |
| Auto Trigger        | ✅       |
| Spam Prevention     | ✅       |

## 🚀 Production Checklist

- [ ] Gmail app password generated
- [ ] `.env` configured with real credentials
- [ ] Admin emails set (production addresses)
- [ ] App URL set to production domain
- [ ] Test email sent and received
- [ ] Emails not in spam
- [ ] Links work correctly
- [ ] Multiple recipients tested
- [ ] Email filters configured
- [ ] Team notified

## 💡 Tips

1. **Use dedicated email:** `alerts@yourdomain.com`
2. **Configure filters:** Auto-label critical alerts
3. **Test in dev first:** Before production
4. **Monitor delivery:** Check console logs
5. **Keep credentials secure:** Use password manager

## ⚠️ Remember

- Only CRITICAL alerts trigger emails
- Rate limited: 1 email/type/15min
- All alerts visible in dashboard
- Email failures don't break app
- Console shows rate limit status

## 🎉 Success Indicators

✅ Test email received  
✅ HTML renders beautifully  
✅ Links work  
✅ Rate limiting works  
✅ Console shows "✅ Critical alert email sent"

---

**Quick Help:** See `docs/EMAIL_NOTIFICATION_SETUP.md`
