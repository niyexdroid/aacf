"use client";

import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=3431&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=3270&auto=format&fit=crop",
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Dark overlay for better text visibility */}
      <div className="hero-dark-overlay absolute inset-0 z-0" />

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentImage ? "w-6 bg-[#ff6b00]" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            Make a Difference Today
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-white/90">
            Join us in our mission to create positive change. Every contribution
            helps us build a better future for those in need.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/donate">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl"
                >
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[#ff6b00] shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
