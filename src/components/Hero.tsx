"use client"

import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />
      
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
            Join us in our mission to create positive change. Every contribution helps us build a better future for those in need.
          </p>
          <Button size="lg" className="mr-4">
            Donate Now
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
