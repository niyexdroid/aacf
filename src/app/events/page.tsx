"use client";

import { Events } from "@/components/Events";
import { useEffect, useState } from "react";
import { fetchEvents } from "@/utils/fetchEvents";
import { Button } from "@/components/ui/Button";

export default function EventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };

    getEvents();
  }, []);

  return (
    <div>
      {/* Pass showViewAllButton={false} to hide the button */}
      <Events events={events} showViewAllButton={false} />

      {/* Buttons container */}
      <div className="mb-16 flex justify-center gap-4">
        <Button className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90">
          View All Events
        </Button>
        <Button className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90">
          Register Now
        </Button>
      </div>
    </div>
  );
}
