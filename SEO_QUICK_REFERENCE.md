# SEO Quick Reference

## 🚀 Quick Links

- **Robots.txt:** `https://aacfoundation.org/robots.txt`
- **Sitemap:** `https://aacfoundation.org/sitemap.xml`
- **Test Structured Data:** [Google Rich Results Test](https://search.google.com/test/rich-results)
- **Test Social Sharing:** [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- **Submit Sitemap:** [Google Search Console](https://search.google.com/search-console)

## ✅ What Was Implemented

### Files Created/Modified

1. ✅ `/public/robots.txt` - Search crawler control
2. ✅ `/src/app/sitemap.ts` - Dynamic XML sitemap
3. ✅ `/src/components/StructuredData.tsx` - JSON-LD components
4. ✅ `/src/app/layout.tsx` - Organization & website data
5. ✅ `/src/app/blog/page.tsx` - Blog listing metadata
6. ✅ `/src/app/blog/[id]/page.tsx` - Blog post metadata + structured data
7. ✅ `/src/app/events/page.tsx` - Events metadata
8. ✅ `/src/app/gallery/page.tsx` - Gallery metadata

### Features

- ✅ Robots.txt with proper directives
- ✅ Auto-updating XML sitemap
- ✅ 5 types of structured data (BlogPosting, Event, Organization, Website, Breadcrumb)
- ✅ Open Graph tags for social media
- ✅ Twitter Card metadata
- ✅ Dynamic metadata for blog posts
- ✅ Breadcrumb navigation data

## 🧪 Testing Checklist

### 1. Verify Files Load

- [ ] Visit `https://aacfoundation.org/robots.txt`
- [ ] Visit `https://aacfoundation.org/sitemap.xml`
- [ ] Check that sitemap includes all blog posts and events

### 2. Validate Structured Data

- [ ] Go to: https://search.google.com/test/rich-results
- [ ] Test a blog post URL: `https://aacfoundation.org/blog/{post-id}`
- [ ] Verify "BlogPosting" is detected
- [ ] Check for zero errors

### 3. Test Social Sharing

- [ ] Facebook: https://developers.facebook.com/tools/debug/
- [ ] Twitter: https://cards-dev.twitter.com/validator
- [ ] Enter blog post URL
- [ ] Verify image, title, description appear correctly

### 4. Submit to Google

- [ ] Go to: https://search.google.com/search-console
- [ ] Add and verify site ownership
- [ ] Submit sitemap: `sitemap.xml`
- [ ] Monitor indexing status

### 5. Run PageSpeed Test

- [ ] Go to: https://pagespeed.web.dev/
- [ ] Enter your homepage URL
- [ ] Check SEO score (should be 90-100%)

## 📝 Content Best Practices

### Blog Posts

**Title:** 50-60 characters, include keyword  
**Excerpt:** 150-160 characters, compelling summary  
**Content:** 500+ words, use headers (H2, H3)  
**Images:** Optimized, descriptive alt text

### Events

**Title:** Clear and descriptive  
**Description:** Who, what, when, where, why  
**Date/Time:** Always keep accurate  
**Location:** Full address when possible

## 🔧 Maintenance

### Weekly

- Check Google Search Console for errors
- Monitor crawl stats

### Monthly

- Review search performance data
- Update old content
- Check broken links

### Quarterly

- Audit site structure
- Review page load speeds
- Competitor analysis

## 📊 Expected Results Timeline

**Weeks 0-2:** Better social previews, proper crawling  
**Weeks 2-8:** Improved rankings, rich snippets, more indexed pages  
**Months 2-6:** 20-50% traffic increase, higher domain authority

## 🎯 Next Actions

1. **Test everything** using checklist above
2. **Submit sitemap** to Google Search Console
3. **Create content calendar** for regular blog posts
4. **Monitor weekly** using Search Console
5. **Optimize images** for better performance

## 📚 Key Resources

- [SEO Implementation Guide](./SEO_IMPLEMENTATION_GUIDE.md) - Full documentation
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org](https://schema.org/)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)

## ⚡ Quick Commands

```bash
# Run development server
pnpm run dev

# Test sitemap locally
# Visit: http://localhost:3000/sitemap.xml

# Test robots.txt locally
# Visit: http://localhost:3000/robots.txt

# Build for production
pnpm run build

# Run linter
pnpm run lint
```

## 🆘 Troubleshooting

**Sitemap not updating?**

- Sitemap is dynamically generated on each request
- Check database connection
- Verify Prisma queries work

**Structured data not showing?**

- Use Google Rich Results Test
- Check for JSON syntax errors
- Google may take 2-4 weeks to show rich results

**Social media preview broken?**

- Images must be absolute URLs
- Minimum size: 1200x630px
- Use Facebook Debugger to scrape again

---

**For detailed information, see:** [SEO_IMPLEMENTATION_GUIDE.md](./SEO_IMPLEMENTATION_GUIDE.md)
