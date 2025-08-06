"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import Link from "next/link";

export function Events({
  events = [],
  showViewAllButton = true, // Default to true
  showDescription = true, // Default to true
  showHeader = true, // Default to true
}: {
  events: any[];
  showViewAllButton?: boolean;
  showDescription?: boolean;
  showHeader?: boolean;
}) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        {showHeader && (
          <h2 className="mb-16 text-center text-3xl font-bold">
            Upcoming Events
          </h2>
        )}

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
                    <span>{event.date}</span>
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

                {/* Conditionally render the description */}
                {showDescription && (
                  <p className="mb-6 flex-1 text-gray-600">
                    {event.description}
                  </p>
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
