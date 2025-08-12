"use client";
import { PhotoGallery } from "./PhotoGallery";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  images?: any[];
}

interface EventGalleryProps {
  event: Event;
  onClose: () => void;
}

export function EventGallery({ event, onClose }: EventGalleryProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-90">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-3xl text-white transition-colors hover:bg-white/10 hover:text-white/75"
          >
            ×
          </button>
        </div>

        <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
          <PhotoGallery images={event.images || []} eventTitle={event.title} />
        </div>
      </div>
    </div>
  );
}
