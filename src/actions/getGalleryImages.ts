"use server";

import { prisma } from "@/lib/prisma";

export async function getGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany();
    return images;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}
