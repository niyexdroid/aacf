"use client";

import { DonorForm } from "@/components/DonorForm";
import { Button } from "@/components/ui/Button";
import { Heart, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Make a Difference Today
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-orange-100">
            Your generous donation helps us continue our mission of creating
            positive change in communities around the world.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="p-6">
              <Users className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-3xl font-bold text-gray-900">1K+</h3>
              <p className="text-gray-600">Lives Impacted</p>
            </div>
            <div className="p-6">
              <Globe className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-3xl font-bold text-gray-900">2+</h3>
              <p className="text-gray-600">Countries Reached</p>
            </div>
            <div className="p-6">
              <Heart className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-3xl font-bold text-gray-900">500K+</h3>
              <p className="text-gray-600">Donations Received</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-gray-600">
                Join our community of supporters and help us create lasting
                change.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
              <DonorForm />
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Other Ways to Support
            </h2>
            <p className="text-lg text-gray-600">
              Every contribution, big or small, makes a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-xl font-semibold">Monthly Giving</h3>
              <p className="mb-4 text-gray-600">
                Become a monthly supporter and provide consistent help to those
                in need.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-xl font-semibold">Volunteer</h3>
              <p className="mb-4 text-gray-600">
                Donate your time and skills to help us make a direct impact.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Globe className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h3 className="mb-2 text-xl font-semibold">Partner With Us</h3>
              <p className="mb-4 text-gray-600">
                Collaborate with us to create sustainable change in communities.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
