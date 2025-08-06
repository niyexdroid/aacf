"use client";

import { useEffect, useState } from "react";
import { fetchGalleryImages } from "@/utils/fetchGallery";
import { fetchEvents } from "@/utils/fetchEvents";
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

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  images?: GalleryImage[];
}

interface LightboxImage {
  url: string;
  title: string;
  caption?: string;
  date?: string;
  eventTitle?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"all" | "events">("all");

  useEffect(() => {
    const loadData = async () => {
      const [galleryImages, eventsData] = await Promise.all([
        fetchGalleryImages(),
        fetchEvents(),
      ]);

      // Process images and organize by events
      const processedImages: GalleryImage[] = galleryImages.map((img: any) => ({
        ...img,
        date: img.timestamp?.toDate?.().toLocaleDateString() || img.date,
      }));

      // Process events and associate images
      const processedEvents: Event[] = eventsData.map((event: any) => ({
        ...event,
        images: processedImages.filter(
          (img: GalleryImage) => img.eventId === event.id,
        ),
      }));

      setImages(processedImages);
      setEvents(processedEvents);
      setLoading(false);
    };

    loadData();
  }, []);

  const openLightbox = (image: GalleryImage, eventTitle?: string) => {
    setLightboxImage({
      url: image.url,
      title: image.title,
      caption: image.caption,
      date: image.date,
      eventTitle,
    });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!lightboxImage) return;

    const allImages = selectedEvent ? selectedEvent.images || [] : images;

    const currentIndex = allImages.findIndex(
      (img) => img.url === lightboxImage.url,
    );

    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    } else {
      newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    }

    const newImage = allImages[newIndex];
    openLightbox(newImage, selectedEvent?.title);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2000"
            alt="Gallery hero"
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="container relative mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <h1 className="mb-4 text-5xl font-bold">Our Gallery</h1>
          <p className="max-w-2xl text-xl">
            Explore moments of impact and transformation through our visual
            journey
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("all");
                setSelectedEvent(null);
              }}
              className={`border-b-2 px-2 py-4 font-medium transition-colors ${
                activeTab === "all"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All Photos ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`border-b-2 px-2 py-4 font-medium transition-colors ${
                activeTab === "events"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Events ({events.length})
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {activeTab === "events" && !selectedEvent && (
            /* Events Grid */
            <div>
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Our Events
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="group cursor-pointer rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={
                          event.image ||
                          `https://picsum.photos/seed/${event.id}/400/300.jpg`
                        }
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {event.title}
                        </h3>
                        <p className="text-sm text-white/80">
                          {event.images?.length || 0} photos
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center">
                          📅 {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">📍 {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || selectedEvent) && (
            /* Photo Gallery */
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedEvent ? selectedEvent.title : "All Photos"}
                  </h2>
                  {selectedEvent && (
                    <p className="mt-2 text-gray-600">
                      {new Date(selectedEvent.date).toLocaleDateString()} •{" "}
                      {selectedEvent.location}
                    </p>
                  )}
                </div>
                {selectedEvent && (
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-900"
                  >
                    ← Back to Events
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {(selectedEvent ? selectedEvent.images || [] : images).map(
                  (image, index) => (
                    <div
                      key={image.id || index}
                      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                      onClick={() => openLightbox(image, selectedEvent?.title)}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20" />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-1 font-semibold text-gray-900">
                          {image.title}
                        </h3>
                        {image.date && (
                          <p className="mb-2 text-sm text-gray-500">
                            {image.date}
                          </p>
                        )}
                        {image.caption && (
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {(selectedEvent ? selectedEvent.images || [] : images).length ===
                0 && (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl text-gray-400">📷</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-600">
                    No photos yet
                  </h3>
                  <p className="text-gray-500">
                    Check back soon for new photos!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-h-[90vh] w-full max-w-6xl">
            {/* Close button */}
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
              onClick={closeLightbox}
            >
              ✕
            </button>

            {/* Navigation buttons */}
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white transition-all hover:bg-opacity-75"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white transition-all hover:bg-opacity-75"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
            >
              →
            </button>

            {/* Image */}
            <div className="relative h-[80vh] w-full">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Image info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="mb-2 text-2xl font-bold">{lightboxImage.title}</h3>
              {lightboxImage.eventTitle && (
                <p className="mb-2 text-lg opacity-90">
                  {lightboxImage.eventTitle}
                </p>
              )}
              {lightboxImage.date && (
                <p className="mb-2 text-sm opacity-75">{lightboxImage.date}</p>
              )}
              {lightboxImage.caption && (
                <p className="text-sm leading-relaxed opacity-90">
                  {lightboxImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
