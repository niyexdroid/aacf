"use client";

import { Button } from "@/components/ui/Button";
import { HandHeart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Volunteer() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=3270&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <HandHeart className="mb-6 h-16 w-16 text-[#ff6b00]" />
          <h2 className="mb-6 text-4xl font-bold">Become a Volunteer</h2>
          <p className="mb-8 max-w-2xl text-lg text-white/90">
            Join our community of dedicated volunteers and help make a real
            difference. Your time and skills can contribute to creating positive
            change in people's lives.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl"
              >
                <HandHeart className="h-5 w-5" />
                Join as Volunteer
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/donate">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 border-[#ff6b00] bg-white text-[#ff6b00] shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
                >
                  <Heart className="h-5 w-5" />
                  Support Our Cause
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
