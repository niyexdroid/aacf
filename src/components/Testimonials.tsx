"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "The work that AAC Foundation does is truly transformative. I've seen firsthand how their programs change lives and build stronger communities.",
    author: "Sarah Johnson",
    role: "Community Partner",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "Being a volunteer with AAC Foundation has been one of the most rewarding experiences of my life. The impact we make is real and lasting.",
    author: "Michael Chen",
    role: "Volunteer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "The dedication and passion of the AAC Foundation team is incredible. They truly care about making a difference in people's lives.",
    author: "Emily Rodriguez",
    role: "Donor",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-3xl font-bold">
          What People Say
        </h2>

        <div className="relative mx-auto max-w-4xl">
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-[#ff6b00]" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-[#ff6b00]" />
          </button>

          <div className="overflow-hidden">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <Quote className="mb-6 h-12 w-12 text-[#ff6b00]" />
              <p className="mb-8 text-xl italic text-gray-700">
                "{testimonials[current]?.quote}"
              </p>
              <img
                src={testimonials[current]?.image}
                alt={testimonials[current]?.author || "Testimonial author"}
                className="mb-4 h-16 w-16 rounded-full object-cover"
              />
              <div className="font-semibold">
                {testimonials[current]?.author}
              </div>
              <div className="text-sm text-gray-500">
                {testimonials[current]?.role}
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "w-6 bg-[#ff6b00]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Donate CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Join Our Mission
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Your support helps us continue making a difference in communities
            around the world.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/donate">
              <Button className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl">
                <Heart className="h-5 w-5" />
                Donate Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
