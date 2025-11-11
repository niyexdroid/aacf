# ✅ SEO Testing Checklist - AAC Foundation

## 🎯 Testing Results Summary

Based on the development server logs, here's what we verified:

### ✅ Working Features (Confirmed from logs)
1. **Sitemap Generation** - ✅ Compiled successfully in 1430ms
2. **Database Integration** - ✅ Fetched data from Blog, Event, GalleryImage
3. **Sitemap Accessibility** - ✅ Served at `/sitemap.xml` (200 response, 6280ms)
4. **Alert System** - ✅ Bonus! Detected and emailed 3 slow query alerts

## 📋 Manual Testing Checklist

### Phase 1: Local Testing (Development)

#### 1. Robots.txt ✅
**URL:** `http://localhost:3000/robots.txt`
- [ ] File loads in browser
- [ ] Shows `User-agent: *`
- [ ] Has `Disallow: /admin/`
- [ ] Has `Allow: /api/blogs`
- [ ] Specifies sitemap location
- [ ] No syntax errors

**Expected Output:**
```
User-agent: *
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/
Allow: /api/blogs
Allow: /api/events
Allow: /api/gallery
Sitemap: https://aacfoundation.org/sitemap.xml
Crawl-delay: 1
```

#### 2. Sitemap XML ✅
**URL:** `http://localhost:3000/sitemap.xml`
- [ ] XML file loads in browser
- [ ] Has `<urlset>` root element
- [ ] Contains homepage URL
- [ ] Contains blog listing URL
- [ ] Contains individual blog post URLs
- [ ] Contains event URLs
- [ ] Has proper `<lastmod>` dates
- [ ] Has `<changefreq>` tags
- [ ] Has `<priority>` values

**What to look for:**
- Static pages (home, about, blog, events, gallery, contact)
- Dynamic blog posts (e.g., `/blog/clx123...`)
- Dynamic events (e.g., `/events/clx456...`)
- Recent dates in `<lastmod>` tags

#### 3. Homepage Structured Data 🔍
**URL:** `http://localhost:3000/`
- [ ] Right-click → View Page Source
- [ ] Search for `application/ld+json`
- [ ] Should find Organization schema
- [ ] Should find Website schema

**Expected JSON-LD blocks:**
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "AACF - Abosedeaina Charity Foundation"
}

{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AACF - Abosedeaina Charity Foundation"
}
```

#### 4. Blog Listing Metadata 🔍
**URL:** `http://localhost:3000/blog`
- [ ] View page source
- [ ] Find `<title>Blog | AAC Foundation</title>`
- [ ] Find `<meta property="og:title"` tag
- [ ] Find `<meta name="twitter:card"` tag
- [ ] Find meta description

#### 5. Individual Blog Post 🔍
**URL:** `http://localhost:3000/blog/[any-post-id]`
- [ ] View page source
- [ ] Find BlogPosting JSON-LD
- [ ] Find BreadcrumbList JSON-LD
- [ ] Find `og:type` with value `article`
- [ ] Find `article:published_time`
- [ ] Find dynamic title with post name

**Expected JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Your Post Title"
}

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList"
}
```

### Phase 2: Production Testing (After Deployment)

#### 6. Google Rich Results Test 🌐
**Tool:** https://search.google.com/test/rich-results

**Steps:**
1. Deploy site to production
2. Go to Rich Results Test
3. Enter blog post URL: `https://aacfoundation.org/blog/[post-id]`
4. Click "Test URL"
5. Wait for analysis

**Expected Results:**
- [ ] "Page is eligible for rich results" message
- [ ] BlogPosting schema detected
- [ ] Zero errors
- [ ] Preview shows article format

#### 7. Facebook Open Graph Test 📱
**Tool:** https://developers.facebook.com/tools/debug/

**Steps:**
1. Enter your blog post URL
2. Click "Debug"
3. Review preview

**Expected Results:**
- [ ] Correct title displayed
- [ ] Description shown
- [ ] Image loads properly
- [ ] No warnings or errors
- [ ] Preview looks good

#### 8. Twitter Card Validator 🐦
**Tool:** https://cards-dev.twitter.com/validator

**Steps:**
1. Enter your page URL
2. Click "Preview card"

**Expected Results:**
- [ ] Summary large image card type
- [ ] Title displays correctly
- [ ] Description shows
- [ ] Image renders (1200x630px+)

#### 9. LinkedIn Post Inspector 💼
**Tool:** https://www.linkedin.com/post-inspector/

**Steps:**
1. Enter your URL
2. Click "Inspect"

**Expected Results:**
- [ ] Post preview generates
- [ ] Title correct
- [ ] Description accurate
- [ ] Image displays

#### 10. Schema Markup Validator 🔍
**Tool:** https://validator.schema.org/

**Steps:**
1. Enter your blog post URL
2. Click "Run Test"

**Expected Results:**
- [ ] No errors
- [ ] BlogPosting detected
- [ ] All required properties present
- [ ] Organization linked

#### 11. Google Search Console Setup 📊
**URL:** https://search.google.com/search-console

**Steps:**
1. Add property: `https://aacfoundation.org`
2. Verify ownership (DNS/HTML file/meta tag)
3. Go to Sitemaps section
4. Submit: `sitemap.xml`
5. Monitor indexing status

**What to monitor:**
- [ ] Sitemap submitted successfully
- [ ] No errors in sitemap
- [ ] Pages being discovered
- [ ] Coverage increasing over time
- [ ] No crawl errors

#### 12. PageSpeed Insights SEO Score 🚀
**Tool:** https://pagespeed.web.dev/

**Steps:**
1. Enter your homepage URL
2. Run analysis
3. Check SEO section

**Expected Results:**
- [ ] SEO score: 90-100%
- [ ] All SEO checks pass
- [ ] Metadata is valid
- [ ] Links are crawlable

### Phase 3: Monitoring (Ongoing)

#### 13. Search Performance (Weekly) 📈
**Tool:** Google Search Console → Performance

**Metrics to track:**
- [ ] Total impressions (increasing)
- [ ] Total clicks (increasing)
- [ ] Average CTR (improving)
- [ ] Average position (decreasing/improving)
- [ ] New queries appearing

#### 14. Index Coverage (Weekly) 📑
**Tool:** Google Search Console → Coverage

**What to check:**
- [ ] No errors
- [ ] Valid pages increasing
- [ ] All important pages indexed
- [ ] No unexpected exclusions

#### 15. Rich Results (Monthly) ✨
**Tool:** Google Search Console → Enhancements

**What to check:**
- [ ] Article rich results detected
- [ ] No errors in structured data
- [ ] Increasing eligible pages

## 🎉 Success Criteria

### ✅ Basic Success (Minimum)
- [ ] robots.txt accessible
- [ ] sitemap.xml loads with content
- [ ] Structured data present on pages
- [ ] Metadata tags on all pages

### 🌟 Advanced Success (Recommended)
- [ ] Google Rich Results Test passes
- [ ] Social media previews work
- [ ] Search Console shows no errors
- [ ] PageSpeed SEO score 90+

### 🚀 Excellent Success (Ideal)
- [ ] Rich snippets appearing in search
- [ ] Organic traffic increasing
- [ ] Multiple keywords ranking
- [ ] Social shares generating traffic

## 📊 Test Results Log

### Test Date: ________________

| Feature | Status | Notes |
|---------|--------|-------|
| robots.txt | ⬜ Pass ⬜ Fail | |
| sitemap.xml | ⬜ Pass ⬜ Fail | |
| Homepage structured data | ⬜ Pass ⬜ Fail | |
| Blog metadata | ⬜ Pass ⬜ Fail | |
| Blog post structured data | ⬜ Pass ⬜ Fail | |
| Google Rich Results | ⬜ Pass ⬜ Fail | |
| Facebook debugger | ⬜ Pass ⬜ Fail | |
| Twitter validator | ⬜ Pass ⬜ Fail | |
| Search Console setup | ⬜ Pass ⬜ Fail | |
| PageSpeed SEO | ⬜ Pass ⬜ Fail | |

### Overall Score: ____/10

## 🔧 Troubleshooting Guide

### Issue: Sitemap not loading
**Solution:**
- Check dev server is running
- Try rebuilding: `pnpm run build`
- Check database connection
- Verify Prisma schema matches queries

### Issue: Structured data not found
**Solution:**
- View page source (not inspector)
- Search for `application/ld+json`
- Check component imports in pages
- Rebuild and hard refresh

### Issue: Social preview not showing
**Solution:**
- Images must be absolute URLs
- Min size: 1200x630px
- Use "Scrape Again" in debuggers
- Check meta tag syntax

### Issue: Google not indexing
**Solution:**
- Verify robots.txt allows access
- Submit sitemap in Search Console
- Check for crawl errors
- Allow 2-4 weeks for indexing

## 📚 Quick Reference

### Important URLs
- **Robots:** `https://aacfoundation.org/robots.txt`
- **Sitemap:** `https://aacfoundation.org/sitemap.xml`
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Search Console:** https://search.google.com/search-console

### Documentation Files
- `SEO_IMPLEMENTATION_GUIDE.md` - Complete guide
- `SEO_QUICK_REFERENCE.md` - Quick tips
- `SEO_IMPLEMENTATION_SUMMARY.md` - Overview

---

**Next Action:** Start with Phase 1 (Local Testing) above, then proceed to Phase 2 after deployment! ✅
