import React from "react"
import "@/styles/globals.css"

import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Hope Foundation | Making a Difference",
  description: "Join us in our mission to create positive change and help those in need through sustainable charitable initiatives.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
