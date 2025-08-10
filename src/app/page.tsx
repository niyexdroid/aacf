"use client";

import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Events } from "@/components/Events";
import { Volunteer } from "@/components/Volunteer";
import { Blog } from "@/components/Blog";
import { Testimonials } from "@/components/Testimonials";
import { useEffect, useState } from "react";
import { fetchEvents } from "@/utils/fetchEvents";

export default function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };

    getEvents();
  }, []);

  return (
    <>
      <Hero />
      <Impact />
      <Events events={events} />
      <Volunteer />
      <Testimonials />
      <Blog />
    </>
  );
}
