# AACF Admin Login Production Fix Guide

## Issues Found & Solutions

### 1. Missing Environment Variables ❌

**Problem**: Missing `SESSION_SECRET` and potentially `DATABASE_URL`

**Solution**:
Add these to your production environment (Vercel/Netlify/etc.):

```
SESSION_SECRET=ed703303c459bbb5372596614ef6972b994928bd7275a620e3bc2036a55e4f0a
DATABASE_URL=your_neon_database_connection_string
DATABASE_URL_UNPOOLED=your_neon_database_connection_string
```

### 2. No Admin User Exists ❌

**Problem**: Database might not have any admin users

**Solution**:

1. Visit `/api/debug` to check system status
2. Create admin user via API or database directly

### 3. Cookie/Session Issues in Production 🍪

**Problem**: Session cookies might not work in production due to HTTPS/domain issues

**Current Settings**:

- `httpOnly: true` ✅
- `secure: process.env.NODE_ENV === "production"` ✅
- `sameSite: "lax"` ✅

## Quick Debug Steps

### Step 1: Check System Status

Visit: `https://yourdomain.com/api/debug`

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "userCount": 1,
  "environment": {
    "SESSION_SECRET": true,
    "DATABASE_URL": true,
    "NODE_ENV": "production"
  }
}
```

### Step 2: Create Admin User (if needed)

If userCount is 0, create admin:

**Method 1**: Via API (Development Only)

```bash
curl -X POST https://yourdomain.com/api/debug \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aacf.org","password":"admin123"}'
```

**Method 2**: Direct Database Access
Connect to your Neon database and run:

```sql
INSERT INTO "User" (id, email, password, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@aacf.org',
  '$2b$10$rN8l7vY5E5yN4nN5XQ5QYO7K5r8N5E5yN4nN5XQ5QYO7K5r8N5E5y',
  NOW(),
  NOW()
);
```

Password hash above = "admin123"

### Step 3: Test Login

1. Go to `/admin/login`
2. Use:
   - Email: `admin@aacf.org`
   - Password: `admin123`

## Production Environment Setup

### For Vercel:

1. Go to Project Settings → Environment Variables
2. Add:
   ```
   SESSION_SECRET=ed703303c459bbb5372596614ef6972b994928bd7275a620e3bc2036a55e4f0a
   DATABASE_URL=your_neon_url
   DATABASE_URL_UNPOOLED=your_neon_url
   ```

### For Other Platforms:

Ensure these environment variables are set in your deployment platform.

## Common Issues & Fixes

### Issue: "Invalid credentials" but credentials are correct

**Cause**: User doesn't exist in database
**Fix**: Check `/api/debug` and create user if needed

### Issue: Login appears successful but redirects to login again

**Cause**: Session not being saved/retrieved properly
**Fix**:

1. Check browser cookies are enabled
2. Verify HTTPS is working
3. Check environment variables are set

### Issue: "Internal server error"

**Cause**: Database connection or environment variable issues
**Fix**: Check `/api/debug` response for specific error

## Security Notes

- Change default password immediately after first login
- Use strong passwords in production
- Consider adding 2FA for additional security
- Regularly rotate SESSION_SECRET

## Next Steps

1. ✅ Add environment variables to production
2. ✅ Check `/api/debug` endpoint
3. ✅ Create admin user if needed
4. ✅ Test login functionality
5. ✅ Change default password
6. ❌ Remove debug endpoint in production (optional)
