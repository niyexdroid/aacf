"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/Button"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  return (
    <motion.header 
      className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Heart className="h-6 w-6 text-primary" />
          <span>AAC Foundation</span>
        </Link>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button size="sm">Donate Now</Button>
        </nav>
      </div>
    </motion.header>
  )
}
