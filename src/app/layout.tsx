import React from "react";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastPortalClient } from "@/components/ToastPortalClient";

export const metadata: Metadata = {
  title: "AAC Foundation | Making a Difference",
  description:
    "Join us in our mission to create positive change and help those in need through sustainable charitable initiatives.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client-only hook usage guard: wrap toast container in a client component shim
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <ToastPortalClient />
      </body>
    </html>
  );
}

// Toast portal moved to client component to avoid server hook usage
