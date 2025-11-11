/**
 * Structured Data Components for SEO
 * Implements schema.org JSON-LD markup for better search engine understanding
 */

interface BlogPostStructuredDataProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string | null;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface EventStructuredDataProps {
  event: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date | null;
    location: string;
    image?: string | null;
  };
}

interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

/**
 * Blog Post Structured Data (Article schema)
 */
export function BlogPostStructuredData({ post }: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || "https://aacfoundation.org/logo.png",
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "AACF - Abosedeaina Charity Foundation",
      url: "https://aacfoundation.org",
    },
    publisher: {
      "@type": "Organization",
      name: "AACF - Abosedeaina Charity Foundation",
      logo: {
        "@type": "ImageObject",
        url: "https://aacfoundation.org/logo.png",
      },
    },
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aacfoundation.org/blog/${post.id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Event Structured Data (Event schema)
 */
export function EventStructuredData({ event }: EventStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() || event.startDate.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
        addressCountry: "NG",
      },
    },
    image: event.image || "https://aacfoundation.org/logo.png",
    organizer: {
      "@type": "Organization",
      name: "AACF - Abosedeaina Charity Foundation",
      url: "https://aacfoundation.org",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Organization Structured Data (NGO/Charity schema)
 */
export function OrganizationStructuredData({
  name = "AACF - Abosedeaina Charity Foundation",
  url = "https://aacfoundation.org",
  logo = "https://aacfoundation.org/logo.png",
  description = "A charity foundation dedicated to making a positive impact in our community through various charitable initiatives and programs.",
  contactEmail = "abosedeainacharityfoundation@gmail.com",
  contactPhone = "+2348168819022",
  socialMedia = {},
}: OrganizationStructuredDataProps = {}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    description,
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      telephone: contactPhone,
      contactType: "General Inquiries",
      availableLanguage: ["English"],
    },
    sameAs: Object.values(socialMedia).filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Website Structured Data (Website schema)
 */
export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AACF - Abosedeaina Charity Foundation",
    url: "https://aacfoundation.org",
    description:
      "Official website of Abosedeaina Charity Foundation - dedicated to making a positive impact through charitable initiatives.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://aacfoundation.org/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Breadcrumb Structured Data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
