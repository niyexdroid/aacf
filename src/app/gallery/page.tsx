import { PhotoGallery } from "@/components/PhotoGallery";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Gallery</h1>
      <PhotoGallery images={images} />
    </div>
  );
}
