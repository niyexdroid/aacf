"use client";

import { getGalleryImages } from "@/actions/getGalleryImages";
import { PhotoGallery } from "@/components/PhotoGallery";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Gallery</h1>
      <PhotoGallery images={images} />
    </div>
  );
}
