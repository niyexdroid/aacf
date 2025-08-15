import { Events } from "@/components/Events";
import { getEvents } from "@/actions/getEvents";

export default async function EventPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="hero-contact-bg absolute inset-0" />
        {/* Dark overlay for better text readability */}
        <div className="hero-dark-overlay absolute inset-0" />

        {/* Content */}
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold drop-shadow-lg">Our Events</h1>
          <p className="mx-auto max-w-2xl text-xl drop-shadow-md">
            Join us in our mission to create positive change. Discover upcoming
            events and community gatherings
          </p>
        </div>
      </section>

      {/* Events Content */}
      <div className="py-16">
        <Events events={events} showViewAllButton={false} />
      </div>
    </div>
  );
}
