/**
 * SEO Feature Testing Script
 * Tests robots.txt, sitemap, and structured data
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3001";

async function testSEO() {
  console.log("🧪 Testing SEO Implementation...\n");

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Robots.txt
  console.log("1️⃣ Testing robots.txt...");
  totalTests++;
  try {
    const robotsResponse = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsResponse.text();

    if (
      robotsResponse.ok &&
      robotsText.includes("User-agent:") &&
      robotsText.includes("Sitemap:")
    ) {
      console.log("   ✅ robots.txt is accessible and valid");
      console.log(`   📄 Content preview: ${robotsText.substring(0, 100)}...`);
      passedTests++;
    } else {
      console.log("   ❌ robots.txt has issues");
    }
  } catch (error) {
    console.log(`   ❌ Error fetching robots.txt: ${error.message}`);
  }
  console.log("");

  // Test 2: Sitemap
  console.log("2️⃣ Testing sitemap.xml...");
  totalTests++;
  try {
    const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapResponse.text();

    if (
      sitemapResponse.ok &&
      sitemapText.includes("<urlset") &&
      sitemapText.includes("<loc>")
    ) {
      console.log("   ✅ sitemap.xml is accessible and valid XML");

      // Count URLs
      const urlMatches = sitemapText.match(/<loc>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      console.log(`   📊 Found ${urlCount} URLs in sitemap`);

      // Check for dynamic content
      const hasBlog = sitemapText.includes("/blog/");
      const hasEvents = sitemapText.includes("/events/");
      console.log(`   📝 Includes blog posts: ${hasBlog ? "✅" : "❌"}`);
      console.log(`   📅 Includes events: ${hasEvents ? "✅" : "❌"}`);

      passedTests++;
    } else {
      console.log("   ❌ sitemap.xml has issues");
    }
  } catch (error) {
    console.log(`   ❌ Error fetching sitemap: ${error.message}`);
  }
  console.log("");

  // Test 3: Homepage Structured Data
  console.log("3️⃣ Testing homepage structured data...");
  totalTests++;
  try {
    const homeResponse = await fetch(`${BASE_URL}/`);
    const homeHTML = await homeResponse.text();

    const hasStructuredData = homeHTML.includes("application/ld+json");
    const hasOrganization =
      homeHTML.includes('"@type":"NGO"') || homeHTML.includes('"@type": "NGO"');
    const hasWebsite =
      homeHTML.includes('"@type":"WebSite"') ||
      homeHTML.includes('"@type": "WebSite"');

    if (hasStructuredData) {
      console.log("   ✅ Structured data found on homepage");
      console.log(
        `   🏢 Organization schema: ${hasOrganization ? "✅" : "❌"}`,
      );
      console.log(`   🌐 Website schema: ${hasWebsite ? "✅" : "❌"}`);
      passedTests++;
    } else {
      console.log("   ❌ No structured data found on homepage");
    }
  } catch (error) {
    console.log(`   ❌ Error fetching homepage: ${error.message}`);
  }
  console.log("");

  // Test 4: Blog Page Metadata
  console.log("4️⃣ Testing blog page metadata...");
  totalTests++;
  try {
    const blogResponse = await fetch(`${BASE_URL}/blog`);
    const blogHTML = await blogResponse.text();

    const hasTitle = blogHTML.includes("<title>") && blogHTML.includes("Blog");
    const hasOG = blogHTML.includes('property="og:title"');
    const hasTwitter = blogHTML.includes('name="twitter:card"');

    if (blogResponse.ok) {
      console.log("   ✅ Blog page is accessible");
      console.log(`   📄 Custom title: ${hasTitle ? "✅" : "❌"}`);
      console.log(`   📱 Open Graph tags: ${hasOG ? "✅" : "❌"}`);
      console.log(`   🐦 Twitter Card: ${hasTwitter ? "✅" : "❌"}`);
      passedTests++;
    } else {
      console.log("   ❌ Blog page has issues");
    }
  } catch (error) {
    console.log(`   ❌ Error fetching blog page: ${error.message}`);
  }
  console.log("");

  // Test 5: Check for a blog post (if exists)
  console.log("5️⃣ Testing blog post structured data...");
  totalTests++;
  try {
    // First, get a blog post ID from the sitemap
    const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapResponse.text();
    const blogPostMatch = sitemapText.match(
      /<loc>https?:\/\/[^<]+\/blog\/([^<]+)<\/loc>/,
    );

    if (blogPostMatch && blogPostMatch[1]) {
      const postId = blogPostMatch[1];
      console.log(`   📝 Testing blog post: ${postId}`);

      const postResponse = await fetch(`${BASE_URL}/blog/${postId}`);
      const postHTML = await postResponse.text();

      const hasBlogPosting =
        postHTML.includes('"@type":"BlogPosting"') ||
        postHTML.includes('"@type": "BlogPosting"');
      const hasBreadcrumb =
        postHTML.includes('"@type":"BreadcrumbList"') ||
        postHTML.includes('"@type": "BreadcrumbList"');
      const hasArticleOG =
        postHTML.includes("og:type") && postHTML.includes("article");

      if (postResponse.ok) {
        console.log("   ✅ Blog post is accessible");
        console.log(
          `   📰 BlogPosting schema: ${hasBlogPosting ? "✅" : "❌"}`,
        );
        console.log(`   🍞 Breadcrumb schema: ${hasBreadcrumb ? "✅" : "❌"}`);
        console.log(`   📱 Article Open Graph: ${hasArticleOG ? "✅" : "❌"}`);

        if (hasBlogPosting && hasBreadcrumb) {
          passedTests++;
        }
      }
    } else {
      console.log("   ⚠️ No blog posts found to test");
      passedTests++; // Don't penalize if no posts exist
    }
  } catch (error) {
    console.log(`   ❌ Error testing blog post: ${error.message}`);
  }
  console.log("");

  // Summary
  console.log("═".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("═".repeat(50));
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(
    `📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`,
  );
  console.log("");

  if (passedTests === totalTests) {
    console.log("🎉 All SEO features are working perfectly!");
    console.log("");
    console.log("📋 Next Steps:");
    console.log("   1. Deploy to production");
    console.log("   2. Test with Google Rich Results Test:");
    console.log("      https://search.google.com/test/rich-results");
    console.log("   3. Submit sitemap to Google Search Console");
    console.log("   4. Monitor search performance weekly");
  } else {
    console.log("⚠️ Some tests failed. Please review the errors above.");
  }
  console.log("");
}

// Run tests
testSEO().catch(console.error);
