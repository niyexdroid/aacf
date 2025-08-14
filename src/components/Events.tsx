"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import Link from "next/link";

export function Events({
  events = [],
  showViewAllButton = true, // Default to true
  truncateDescription = false,
}: {
  events: any[];
  showViewAllButton?: boolean;
  truncateDescription?: boolean;
}) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold">All Events</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-4 text-xl font-semibold">{event.title}</h3>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="mb-6 flex-1 text-gray-600">
                  {(() => {
                    if (!event.description) return null;
                    if (!truncateDescription) return event.description;
                    const words = event.description.split(/\s+/);
                    const LIMIT = 30;
                    if (words.length <= LIMIT) return event.description;
                    return words.slice(0, LIMIT).join(" ") + "...";
                  })()}
                </p>
                {truncateDescription &&
                  event.description &&
                  event.description.split(/\s+/).length > 30 && (
                    <div className="pb-4">
                      <Link
                        href="/events"
                        className="text-sm font-medium text-orange-600 hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Conditionally render the "View All Events" button */}
        {showViewAllButton && (
          <div className="mt-12 text-center">
            <Link href="/events">
              <Button className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90">
                View All Events
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
