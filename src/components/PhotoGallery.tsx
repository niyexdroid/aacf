"use client";
import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
  date?: string;
  eventId?: string;
  timestamp?: any;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  eventTitle?: string;
  onImageClick?: (image: GalleryImage) => void;
}

export function PhotoGallery({
  images,
  eventTitle,
  onImageClick,
}: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleImageClick = (image: GalleryImage) => {
    if (onImageClick) {
      onImageClick(image);
    } else {
      setSelectedImage(image);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20" />
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-gray-900">
                {image.title}
              </h3>
              {image.date && (
                <p className="mb-2 text-sm text-gray-500">{image.date}</p>
              )}
              {image.caption && (
                <p className="line-clamp-2 text-sm text-gray-600">
                  {image.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl text-gray-400">📷</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-600">
            No photos yet
          </h3>
          <p className="text-gray-500">Check back soon for new photos!</p>
        </div>
      )}

      {/* Legacy Modal (only used if onImageClick is not provided) */}
      {selectedImage && !onImageClick && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl">
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <div className="relative h-[80vh] w-full">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="mb-2 text-2xl font-bold">{selectedImage.title}</h3>
              {eventTitle && (
                <p className="mb-2 text-lg opacity-90">{eventTitle}</p>
              )}
              {selectedImage.date && (
                <p className="mb-2 text-sm opacity-75">{selectedImage.date}</p>
              )}
              {selectedImage.caption && (
                <p className="text-sm leading-relaxed opacity-90">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
