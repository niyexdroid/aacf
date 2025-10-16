import React from "react";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AAC Foundation | Making a Difference",
  description:
    "Join us in our mission to create positive change and help those in need through sustainable charitable initiatives.",
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://aacfoundation.org"),
  icons: {
    icon: "/Logo.jpg",
    apple: "/Logo.jpg",
    shortcut: "/Logo.jpg",
  },
  openGraph: {
    title: "AAC Foundation | Making a Difference",
    description:
      "Join us in our mission to create positive change and help those in need through sustainable charitable initiatives.",
    images: ["/Logo.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AAC Foundation | Making a Difference",
    description:
      "Join us in our mission to create positive change and help those in need through sustainable charitable initiatives.",
    images: ["/Logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta name="theme-color" content="#ea580c" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-TileImage" content="/Logo.jpg" />
        <link rel="mask-icon" href="/Logo.jpg" color="#ea580c" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ToastProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
