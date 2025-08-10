"use client";

import { motion } from "framer-motion";
import { Menu, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/Logo.jpg"
            alt="Abosede Aina Foundation"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                (item.href === "/" && pathname === "/") || // Special case for Home
                (item.href !== "/" && pathname.startsWith(item.href)) // For other links
                  ? "border-b-2 border-[#ff6b00] text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/donate">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </motion.div>
          </Link>
        </nav>
        <Button
          className="md:hidden"
          variant="outline"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {isMenuOpen && (
          <nav className="absolute left-0 right-0 top-20 bg-white shadow-md md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  (item.href === "/" && pathname === "/") || // Special case for Home
                  (item.href !== "/" && pathname.startsWith(item.href)) // For other links
                    ? "w-fit border-b-2 border-[#ff6b00] text-primary" // Add w-fit for mobile
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/donate">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  className="m-4 flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl"
                >
                  <Heart className="h-4 w-4" />
                  Donate Now
                </Button>
              </motion.div>
            </Link>
          </nav>
        )}
      </div>
    </motion.header>
  );
}
