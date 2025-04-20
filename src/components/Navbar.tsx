"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button
            size="sm"
            className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90"
          >
            Donate Now
          </Button>
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
                className="block px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="m-4 bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90"
            >
              Donate Now
            </Button>
          </nav>
        )}
      </div>
    </motion.header>
  );
}
