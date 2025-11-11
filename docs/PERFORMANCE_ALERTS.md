# Performance Alerts System

## 📋 Overview

The Performance Alerts system provides **automated monitoring and proactive notifications** for performance issues in your Next.js application. It automatically detects and alerts on:

- Slow database queries
- Slow API responses
- High error rates
- Poor cache performance
- Authentication failures

**NEW:** 📧 **Email Notifications** - Critical alerts are now automatically sent to admin emails!

## 📧 Email Notifications

### How It Works

- **Automatic:** Critical alerts trigger email notifications immediately
- **Smart Rate Limiting:** Maximum 1 email per alert type per 15 minutes (prevents spam)
- **Professional Design:** Beautiful HTML emails with all alert details
- **Quick Actions:** Direct links to dashboard and logs in every email

### Setup Email Notifications

#### Step 1: Configure Gmail SMTP

Add these variables to your `.env` file:

```bash
# Email Configuration
EMAIL_SMTP_USER="your-email@gmail.com"
EMAIL_SMTP_PASS="your-app-specific-password"
EMAIL_FROM="your-email@gmail.com"

# Admin Alert Email (can be comma-separated for multiple recipients)
ADMIN_ALERT_EMAIL="admin@example.com,admin2@example.com"

# Application URL (for links in emails)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

#### Step 2: Generate Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_SMTP_PASS` in your `.env` file

#### Step 3: Test Email Notifications

Run the test script to verify email delivery:

```bash
npx tsx scripts/test-alert-emails.ts
```

This will:

- Trigger multiple critical alerts
- Send test emails to configured admin addresses
- Display all created alerts in console
- Show rate limiting in action

### Email Features

✅ **Only Critical Alerts** - Emails sent only for critical severity  
✅ **Rate Limited** - Max 1 email per alert type per 15 minutes  
✅ **Beautiful HTML** - Professional design with color-coded severity  
✅ **Rich Details** - All alert metadata included in email  
✅ **Quick Actions** - Direct links to dashboard and logs  
✅ **Plain Text Fallback** - Works in all email clients  
✅ **Multiple Recipients** - Support for comma-separated admin emails

### Email Rate Limiting

To prevent email spam, alerts are rate-limited:

- **Per Alert Type:** Each alert type has independent rate limit
- **15-Minute Window:** Only 1 email per alert type per 15 minutes
- **Console Logging:** Rate-limited emails logged to console
- **No Data Loss:** Alerts still appear in dashboard even if email skipped

Example:

```
10:00 AM - Critical slow_query alert → Email sent ✅
10:05 AM - Another slow_query alert → Email skipped (rate limited) ⏭️
10:16 AM - Another slow_query alert → Email sent ✅ (15 min passed)
```

### Troubleshooting Email

#### Emails Not Sending

1. **Check Environment Variables:**

   ```bash
   echo $EMAIL_SMTP_USER
   echo $EMAIL_SMTP_PASS
   echo $ADMIN_ALERT_EMAIL
   ```

2. **Verify Gmail App Password:**

   - Must be 16 characters
   - No spaces
   - Enable 2-Step Verification first

3. **Check Console Logs:**

   ```bash
   # Look for email-related logs
   grep -i "email" logs/*.log
   ```

4. **Test with Script:**
   ```bash
   npx tsx scripts/test-alert-emails.ts
   ```

#### Emails Going to Spam

- Add sender email to your contacts
- Mark first email as "Not Spam"
- Check SPF/DKIM settings for your domain

#### Multiple Recipients Not Working

Ensure comma-separated format with no spaces:

```bash
# ✅ Correct
ADMIN_ALERT_EMAIL="admin1@example.com,admin2@example.com"

# ❌ Wrong (has spaces)
ADMIN_ALERT_EMAIL="admin1@example.com, admin2@example.com"
```

## 🎯 Alert Types

### 1. Slow Query Alerts

**Type:** `slow_query`  
**Triggers:** When database queries exceed the configured threshold  
**Default Threshold:** 100ms  
**Example:**

```
🔴 CRITICAL: Slow database query detected
Details: findMany on User table took 250ms
```

### 2. High Error Rate Alerts

**Type:** `high_error_rate`  
**Triggers:** When error percentage exceeds threshold over 5-minute window  
**Default Threshold:** 5%  
**Example:**

```
🟡 WARNING: High error rate detected
Details: 8.5% error rate over last 5 minutes (12 errors / 141 requests)
```

### 3. Slow API Alerts

**Type:** `slow_api`  
**Triggers:** When API endpoints exceed response time threshold  
**Default Threshold:** 500ms  
**Example:**

```
🟡 WARNING: Slow API response detected
Details: GET /api/events took 750ms (status: 200)
```

### 4. Cache Miss Rate Alerts

**Type:** `cache_miss_rate`  
**Triggers:** When cache miss percentage is too high  
**Default Threshold:** 50%  
**Example:**

```
🔵 INFO: High cache miss rate detected
Details: 65% miss rate over last 5 minutes (130 misses / 200 operations)
```

### 5. Authentication Failures

**Type:** `authentication_failures`  
**Triggers:** When too many failed login attempts occur  
**Default Threshold:** 5 failures in 5 minutes  
**Example:**

```
🔴 CRITICAL: Multiple authentication failures detected
Details: 7 failed login attempts in the last 5 minutes
```

## 🚦 Severity Levels

### 🔵 INFO

- **Purpose:** Informational notices about potential issues
- **Action Required:** Monitor, no immediate action needed
- **Examples:** High cache miss rate, moderate response times
- **Color:** Blue border/background in UI

### 🟡 WARNING

- **Purpose:** Issues that may impact performance but aren't critical
- **Action Required:** Investigate when convenient
- **Examples:** Slightly slow queries (100-200ms), error rate 5-10%
- **Color:** Yellow border/background in UI

### 🔴 CRITICAL

- **Purpose:** Serious issues requiring immediate attention
- **Action Required:** Investigate and resolve promptly
- **Examples:** Very slow queries (>500ms), error rate >10%, security issues
- **Color:** Red border/background in UI

## ⚙️ Default Thresholds

```typescript
{
  slowQueryMs: 100,           // Database queries slower than 100ms
  slowApiMs: 500,             // API requests slower than 500ms
  errorRatePercent: 5,        // Error rate above 5%
  cacheMissRatePercent: 50,   // Cache miss rate above 50%
  authFailureCount: 5         // More than 5 auth failures in 5 minutes
}
```

## 🔧 Configuration

### Viewing Current Thresholds

```bash
GET /api/admin/alerts/thresholds
```

**Response:**

```json
{
  "thresholds": {
    "slowQueryMs": 100,
    "slowApiMs": 500,
    "errorRatePercent": 5,
    "cacheMissRatePercent": 50,
    "authFailureCount": 5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Updating Thresholds

```bash
PUT /api/admin/alerts/thresholds
Content-Type: application/json

{
  "slowQueryMs": 150,
  "errorRatePercent": 3
}
```

**Validation Rules:**

- `slowQueryMs`: Must be > 0
- `slowApiMs`: Must be > 0
- `errorRatePercent`: Must be 0-100
- `cacheMissRatePercent`: Must be 0-100
- `authFailureCount`: Must be > 0

**Response:**

```json
{
  "success": true,
  "thresholds": {
    "slowQueryMs": 150,
    "slowApiMs": 500,
    "errorRatePercent": 3,
    "cacheMissRatePercent": 50,
    "authFailureCount": 5
  }
}
```

### Recommended Thresholds by Environment

#### Development

```typescript
{
  slowQueryMs: 200,           // More lenient for local DB
  slowApiMs: 1000,            // More lenient for dev server
  errorRatePercent: 10,       // Expect more errors during development
  cacheMissRatePercent: 60,   // Cache warming up
  authFailureCount: 10        // Testing scenarios
}
```

#### Staging

```typescript
{
  slowQueryMs: 150,
  slowApiMs: 750,
  errorRatePercent: 7,
  cacheMissRatePercent: 55,
  authFailureCount: 7
}
```

#### Production

```typescript
{
  slowQueryMs: 100,           // Strict performance requirements
  slowApiMs: 500,             // Fast API responses
  errorRatePercent: 5,        // Low error tolerance
  cacheMissRatePercent: 50,   // Efficient caching
  authFailureCount: 5         // Security sensitive
}
```

## 📊 Using the Performance Dashboard

### Accessing the Dashboard

Navigate to `/admin/performance` (requires authentication)

### Dashboard Features

#### 1. **Active Alerts Section**

- Shows all active alerts with color-coded severity
- Displays alert count badge
- Real-time updates every 5 seconds

#### 2. **Alert Actions**

- **Dismiss Individual Alert:** Click the X button on any alert
- **Dismiss All Alerts:** Click "Dismiss All" at the top right
- Dismissed alerts are hidden but not deleted

#### 3. **Alert Details**

Each alert shows:

- **Severity Badge:** Color-coded (blue/yellow/red)
- **Message:** Clear description of the issue
- **Timestamp:** When the alert was triggered
- **Metadata:** Additional details (duration, table name, etc.)

#### 4. **Auto-Refresh**

- Alerts refresh every 5 seconds
- No manual refresh needed
- Real-time performance monitoring

## 🔍 API Reference

### Get Alerts

```bash
GET /api/admin/alerts
```

**Query Parameters:**

- `severity`: Filter by severity (`info`, `warning`, `critical`)
- `type`: Filter by type (`slow_query`, `high_error_rate`, etc.)
- `includeDismissed`: Include dismissed alerts (default: `false`)

**Example:**

```bash
GET /api/admin/alerts?severity=critical&includeDismissed=false
```

**Response:**

```json
{
  "alerts": [
    {
      "id": "alert_123456789",
      "type": "slow_query",
      "severity": "critical",
      "message": "Slow database query detected",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "metadata": {
        "operation": "findMany",
        "table": "User",
        "duration": 250
      },
      "dismissed": false
    }
  ],
  "stats": {
    "total": 15,
    "active": 12,
    "dismissed": 3,
    "bySeverity": {
      "info": 5,
      "warning": 8,
      "critical": 2
    },
    "byType": {
      "slow_query": 3,
      "high_error_rate": 1,
      "slow_api": 6,
      "cache_miss_rate": 4,
      "authentication_failures": 1
    }
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

### Dismiss Alerts

```bash
DELETE /api/admin/alerts?id=alert_123456789
```

**Dismiss All:**

```bash
DELETE /api/admin/alerts
```

**Response:**

```json
{
  "success": true,
  "dismissed": 1
}
```

## 🛠️ Integration Examples

### Programmatic Alert Checking

The AlertManager is automatically integrated with the logging system, but you can also use it directly:

```typescript
import { alertManager } from "@/lib/alerts";

// Check for slow query
alertManager.checkSlowQuery("findMany", "User", 250);

// Check for slow API
alertManager.checkSlowApi("GET", "/api/events", 750, 200);

// Check cache performance
alertManager.checkCachePerformance("miss");

// Check error rate
alertManager.checkErrorRate();

// Check auth failures
alertManager.checkAuthFailures();

// Get all active alerts
const alerts = alertManager.getAlerts();

// Get statistics
const stats = alertManager.getStats();

// Subscribe to alert updates
alertManager.subscribe((alerts) => {
  console.log("Alerts updated:", alerts);
});
```

### Custom Thresholds in Code

```typescript
import { alertManager } from "@/lib/alerts";

// Update thresholds programmatically
alertManager.updateThresholds({
  slowQueryMs: 150,
  errorRatePercent: 3,
});
```

## 📈 Monitoring Best Practices

### 1. **Regular Review**

- Check the performance dashboard daily
- Review alert trends weekly
- Adjust thresholds based on patterns

### 2. **Alert Response**

- **Critical Alerts:** Respond within 1 hour
- **Warning Alerts:** Review within 24 hours
- **Info Alerts:** Review during regular maintenance

### 3. **Threshold Tuning**

- Start with default thresholds
- Monitor false positive rate
- Adjust based on application behavior
- Document threshold changes

### 4. **Alert Fatigue Prevention**

- Don't set thresholds too strict
- Dismiss resolved alerts promptly
- Address root causes, not just symptoms
- Use appropriate severity levels

## 🐛 Troubleshooting

### Issue: Too Many Alerts

**Symptoms:** Dashboard flooded with alerts  
**Causes:**

- Thresholds too strict
- Actual performance degradation
- Traffic spike

**Solutions:**

1. Check if alerts indicate real issues
2. Adjust thresholds if needed:
   ```typescript
   PUT /api/admin/alerts/thresholds
   { "slowQueryMs": 200, "slowApiMs": 1000 }
   ```
3. Optimize slow queries/APIs
4. Scale infrastructure if needed

### Issue: No Alerts Appearing

**Symptoms:** No alerts in dashboard despite expected issues  
**Causes:**

- Thresholds too lenient
- Logging not working
- AlertManager not integrated

**Solutions:**

1. Check logger integration:
   ```bash
   GET /api/admin/logs?level=error
   ```
2. Verify thresholds:
   ```bash
   GET /api/admin/alerts/thresholds
   ```
3. Check for errors in console
4. Verify authentication working

### Issue: Dismissed Alerts Reappearing

**Symptoms:** Same alert keeps coming back  
**Cause:** Underlying issue not resolved  
**Solution:**

1. Review alert metadata for root cause
2. Fix the underlying performance issue
3. Alerts will stop once issue resolved

### Issue: Slow Dashboard Loading

**Symptoms:** Performance dashboard takes long to load  
**Causes:**

- Too many alerts in memory
- Large log files
- Network latency

**Solutions:**

1. Clear old alerts:
   ```bash
   DELETE /api/admin/alerts
   ```
2. Increase auto-refresh interval
3. Filter alerts by severity/type
4. Check network connection

## 🔐 Security Considerations

### Authentication Required

All alert endpoints require authentication via `getSession()`:

- `/api/admin/alerts`
- `/api/admin/alerts/thresholds`
- `/admin/performance`

### Rate Limiting

Consider implementing rate limiting on alert endpoints to prevent abuse:

```typescript
// Example: Max 100 requests per minute per user
```

### Sensitive Data

Alert metadata may contain sensitive information:

- Table names
- Query patterns
- API endpoints
- Error messages

**Recommendation:** Restrict access to authorized personnel only.

## 📊 Metrics Tracked

### Time Windows

All metrics use a **5-minute rolling window**:

- Recent errors (last 5 minutes)
- Recent requests (last 5 minutes)
- Recent cache hits (last 5 minutes)
- Recent cache misses (last 5 minutes)
- Recent auth failures (last 5 minutes)

### Alert Limits

- **Maximum Alerts:** 100 in memory
- **Duplicate Prevention:** 5-minute window
- **Auto-Cleanup:** Oldest alerts removed when limit reached

### Retention

Alerts are stored in memory and reset on server restart. For persistent storage, consider:

- Logging alerts to database
- Exporting to external monitoring service
- Archiving dismissed alerts

## 🚀 Future Enhancements

### Planned Features

- [ ] Email notifications for critical alerts
- [ ] Slack/Teams integration
- [ ] Alert history persistence
- [ ] Automated alert resolution
- [ ] Machine learning for threshold tuning
- [ ] Alert aggregation and grouping
- [ ] Custom alert rules
- [ ] Webhook support

### Contributing

To add new alert types:

1. **Update Alert Types**

   ```typescript
   // In src/lib/alerts.ts
   export type AlertType =
     | "slow_query"
     | "high_error_rate"
     | "slow_api"
     | "cache_miss_rate"
     | "authentication_failures"
     | "YOUR_NEW_TYPE"; // Add here
   ```

2. **Add Check Method**

   ```typescript
   checkYourNewCondition(/* params */) {
     // Implement checking logic
     // Create alert if threshold exceeded
   }
   ```

3. **Integrate with Logger**

   ```typescript
   // In src/lib/logger.ts
   alertManager.checkYourNewCondition(/* params */);
   ```

4. **Update Thresholds**
   ```typescript
   // Add to AlertThresholds interface
   export interface AlertThresholds {
     // ... existing
     yourNewThreshold: number;
   }
   ```

## 📝 Summary

The Performance Alerts system provides:

- ✅ **Automated Monitoring:** No manual checking needed
- ✅ **Proactive Notifications:** Catch issues before users do
- ✅ **Configurable Thresholds:** Adapt to your needs
- ✅ **Real-time Updates:** 5-second refresh rate
- ✅ **Easy Management:** Dismiss alerts with one click
- ✅ **Comprehensive Coverage:** DB, API, cache, auth monitoring

For questions or issues, refer to the troubleshooting section or check the implementation files:

- `src/lib/alerts.ts` - Core AlertManager
- `src/lib/logger.ts` - Logger integration
- `src/app/api/admin/alerts/route.ts` - Alerts API
- `src/app/admin/performance/page.tsx` - Dashboard UI

---

**Last Updated:** January 2024  
**Version:** 1.0.0
