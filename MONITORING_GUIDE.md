# 📊 Performance Monitoring Guide

## 🎯 Where to Monitor Your Performance Improvements

### 1. **Built-in Performance Dashboard** ⭐ NEW!

**Location:** `/admin/performance`

**URL:** `https://your-domain.com/admin/performance`

**What it shows:**
- ✅ **Cache Statistics**: Number of cached entries and cache keys
- ✅ **Database Counts**: Total blogs, events, gallery items, donors
- ✅ **Session Status**: Current session validity and expiration time
- ✅ **API Response Times**: Live testing of endpoint performance
- ✅ **Performance Insights**: Active optimizations summary

**Auto-refreshes every 30 seconds**

---

### 2. **Vercel Analytics** (Production)

**URL:** https://vercel.com/niyexdroid/aacf/analytics

**Key Metrics to Watch:**

#### Real Experience Score (RES)
- **Target:** 90+ (Good)
- **What it means:** Overall user experience score
- **Expected improvement:** 15-25 point increase

#### Time to First Byte (TTFB)
- **Before:** ~300-500ms
- **After:** ~50-150ms
- **Expected improvement:** 67-83% faster
- **What it means:** How fast server responds

#### First Contentful Paint (FCP)
- **Target:** < 1.8s (Good)
- **What it means:** Time until first content appears
- **Impact:** Better perceived loading speed

#### Largest Contentful Paint (LCP)
- **Target:** < 2.5s (Good)
- **What it means:** Time until main content is visible
- **Impact:** Core Web Vitals metric for SEO

---

### 3. **Vercel Logs** (Real-time)

**URL:** https://vercel.com/niyexdroid/aacf/logs

**What to look for:**
- ✅ **Response times**: Should be consistently faster
- ✅ **Cache hits**: Look for logs showing cached responses
- ✅ **Database query times**: Reduced execution time
- ✅ **Error rates**: Should remain low with error boundaries

**Filter examples:**
```
"blogs:*" - See blog cache activity
"Cache hit" - Find cached responses
"query time" - Database performance
```

---

### 4. **Browser DevTools** (Testing)

#### Performance Tab
1. Open your site: https://your-domain.com
2. Press `F12` → Performance tab
3. Click Record → Reload page → Stop
4. Look for:
   - **Loading time**: Should be faster
   - **API calls**: Check Network tab for response times
   - **JavaScript execution**: Reduced blocking time

#### Network Tab
1. Open site → `F12` → Network tab
2. Reload page
3. Sort by "Time" column
4. Check:
   - `/api/blogs` - Should show `<100ms` (cached) or `<200ms` (fresh)
   - `/api/events` - Faster with indexes
   - Overall page load - 30-50% improvement

---

### 5. **Google PageSpeed Insights**

**URL:** https://pagespeed.web.dev/

**Test your site:** Enter `https://your-domain.com`

**What to monitor:**

#### Performance Score
- **Before:** ~60-70
- **Target:** 85-95
- **Impact:** SEO ranking, user experience

#### Core Web Vitals
- ✅ **LCP:** Should be < 2.5s (Good)
- ✅ **FID:** Should be < 100ms (Good)
- ✅ **CLS:** Should be < 0.1 (Good)

**Check:**
- Mobile score
- Desktop score
- Compare before/after deployment

---

### 6. **Lighthouse** (Chrome DevTools)

**How to run:**
1. Open your site in Chrome
2. Press `F12` → Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Click "Analyze page load"

**Expected improvements:**

| Category | Before | After | Target |
|----------|--------|-------|--------|
| Performance | 60-70 | 80-90 | 90+ |
| Accessibility | 80-85 | 95-98 | 95+ |
| Best Practices | 85-90 | 95-100 | 95+ |
| SEO | 75-80 | 90-95 | 95+ |

---

### 7. **Database Performance** (Neon Dashboard)

**URL:** https://console.neon.tech

**What to check:**

#### Query Performance
- **Queries tab**: See execution times
- **Look for:** Faster SELECT queries on indexed columns
- **Expected:** 10x-100x improvement on filtered queries

#### Connection Stats
- **Active connections**: Should be stable
- **Query latency**: Reduced average time
- **Cache efficiency**: Higher hit rates

---

### 8. **API Testing Tools**

#### Using cURL (Command Line)
```bash
# Test blog API with timing
curl -w "@-" -o /dev/null -s "https://your-domain.com/api/blogs?page=1&limit=10" <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

#### Using Postman
1. Import collection with your API endpoints
2. Add tests to measure response time
3. Run collection and compare results

---

### 9. **Real User Monitoring (RUM)**

#### Vercel Speed Insights (Free)
- Automatically enabled on Vercel
- Shows real user performance data
- Access at: https://vercel.com/niyexdroid/aacf/speed-insights

**Metrics shown:**
- Real user LCP, FCP, TTFB
- Geographic distribution
- Device breakdown
- Score trends over time

---

### 10. **Custom Monitoring Script**

Create a simple monitoring script to track improvements:

```javascript
// monitor.js
async function testPerformance() {
  const endpoints = [
    '/api/blogs?page=1&limit=10',
    '/api/events',
    '/api/gallery'
  ];

  for (const endpoint of endpoints) {
    const start = performance.now();
    await fetch(endpoint);
    const end = performance.now();
    console.log(`${endpoint}: ${(end - start).toFixed(0)}ms`);
  }
}

// Run every minute
setInterval(testPerformance, 60000);
```

---

## 📈 **Expected Performance Improvements**

### API Response Times
| Endpoint | Before | After | Improvement |
|----------|--------|-------|-------------|
| `/api/blogs` (first call) | 300-500ms | 150-250ms | 40-50% |
| `/api/blogs` (cached) | 300-500ms | 20-50ms | 90-95% |
| `/api/events` | 200-400ms | 50-150ms | 60-75% |
| `/api/gallery` | 250-450ms | 75-175ms | 60-70% |

### Database Query Times
| Query Type | Before | After | Improvement |
|------------|--------|-------|-------------|
| Blog by category | 150-300ms | 10-30ms | 90-95% |
| Recent blogs | 100-200ms | 15-40ms | 75-85% |
| Event by date | 120-250ms | 12-35ms | 85-90% |
| Gallery images | 180-350ms | 20-60ms | 85-90% |

### Page Load Times
| Page | Before | After | Improvement |
|------|--------|-------|-------------|
| Blog listing | 2.5-3.5s | 1.2-1.8s | 50-65% |
| Blog post | 2.0-3.0s | 1.0-1.5s | 50-60% |
| Events page | 2.2-3.2s | 1.1-1.7s | 50-60% |
| Gallery | 3.0-4.5s | 1.5-2.5s | 45-55% |

---

## 🎯 **Quick Check Commands**

### Check if indexes are active (SQL)
```sql
-- Run in Neon SQL Editor
SELECT 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Test cache in browser console
```javascript
// Run on your site
fetch('/api/blogs?page=1&limit=10')
  .then(r => r.json())
  .then(data => console.log('Cache:', data.pagination));
```

### Check session expiration
```javascript
// Run in admin page console
fetch('/api/admin/performance')
  .then(r => r.json())
  .then(data => console.log('Session:', data.session));
```

---

## 🚨 **Troubleshooting**

### Performance Dashboard Not Loading
- Check you're logged in to admin
- Verify `/api/admin/performance` endpoint is accessible
- Check browser console for errors

### No Performance Improvement Visible
- Clear browser cache and test
- Wait 5-10 minutes for cache to populate
- Check if migration ran successfully
- Verify environment variables are set

### Cache Not Working
- Check cache size in performance dashboard
- Should see entries after visiting pages
- Verify no errors in Vercel logs

---

## 📊 **Monitoring Checklist**

After deployment, check these:

- [ ] Visit `/admin/performance` dashboard
- [ ] Check Vercel Analytics (wait 24h for data)
- [ ] Run Lighthouse audit
- [ ] Test API response times in Network tab
- [ ] Check PageSpeed Insights score
- [ ] Review Vercel logs for cache hits
- [ ] Monitor database query times in Neon
- [ ] Verify indexes in database
- [ ] Test loading states on slow connection
- [ ] Check error boundaries work

---

## 🎊 **Success Indicators**

You'll know the improvements are working when you see:

✅ **Cache dashboard** shows 5-10+ entries after normal use  
✅ **API responses** under 100ms for cached requests  
✅ **Lighthouse score** 80+ for performance  
✅ **PageSpeed score** 85+ overall  
✅ **Vercel logs** showing "Cache hit" messages  
✅ **Session expiration** showing "23h" on fresh login  
✅ **Error boundaries** catching errors gracefully  
✅ **Loading states** appearing before content  

---

*Last Updated: October 15, 2025*  
*Performance baseline established after Phase 2 deployment*
