import { PhotoGallery } from "@/components/PhotoGallery";
import prisma from "@/lib/prisma";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | AAC Foundation",
  description:
    "Explore our journey through moments that capture the impact we're making in communities. View photos from our events, programs, and the lives we've touched.",
  openGraph: {
    title: "Gallery | AAC Foundation",
    description:
      "Explore moments that capture the impact we're making in communities through our charitable work.",
    images: ["/Logo.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | AAC Foundation",
    description:
      "Explore moments that capture the impact we're making in communities.",
    images: ["/Logo.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="hero-contact-bg absolute inset-0" />
        {/* Dark overlay for better text readability */}
        <div className="hero-dark-overlay absolute inset-0" />

        {/* Content */}
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold drop-shadow-lg">Gallery</h1>
          <p className="mx-auto max-w-2xl text-xl drop-shadow-md">
            Explore our journey through moments that capture the impact we're
            making in communities across Africa
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-16">
        <PhotoGallery images={images} />
      </div>
    </div>
  );
}
