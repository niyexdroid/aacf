"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "./ui/Button"

const events = [
  {
    title: "Annual Charity Gala",
    date: "March 15, 2024",
    time: "6:00 PM",
    location: "Grand Ballroom, Ritz Carlton",
    description: "Join us for an elegant evening of fine dining and entertainment to support our global education initiatives. All proceeds go directly to building schools in developing nations.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=3269&auto=format&fit=crop"
  },
  {
    title: "Community Outreach Day",
    date: "April 2, 2024",
    time: "9:00 AM",
    location: "Central Community Center",
    description: "A day dedicated to local community service. Volunteers will participate in various activities including food distribution, health checkups, and youth mentoring programs.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=3270&auto=format&fit=crop"
  },
  {
    title: "Fundraising Marathon",
    date: "May 20, 2024",
    time: "7:30 AM",
    location: "City Park",
    description: "Run for a cause! Join our annual marathon to raise funds for children's healthcare. Choose between 5K, 10K, or full marathon distances.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=3270&auto=format&fit=crop"
  }
]

export function Events() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold">Upcoming Events</h2>
        
        <div className="grid grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div 
              key={index}
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
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{event.title}</h3>
                
                <div className="mb-4 space-y-2 text-gray-600">
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
                
                <p className="mb-6 flex-1 text-gray-600">{event.description}</p>
                
                <Button 
                  className="mt-auto w-full bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90"
                >
                  Register Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  )
}
