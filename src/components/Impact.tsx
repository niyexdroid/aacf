import { Heart, Users, Globe, HandHeart, School, Sprout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  {
    icon: Users,
    value: "1K+",
    label: "Lives Impacted",
    description: "People helped through our programs and initiatives worldwide",
  },
  {
    icon: Globe,
    value: "2+",
    label: "Countries Reached",
    description:
      "Making a difference across continents through sustainable programs",
  },
  {
    icon: Heart,
    value: "500k+",
    label: "Donations Received",
    description: "Generous contributions from supporters enabling our mission",
  },
  {
    icon: HandHeart,
    value: "200+",
    label: "Active Volunteers",
    description: "Dedicated individuals giving their time to make a difference",
  },
  {
    icon: School,
    value: "3+",
    label: "Education Centers",
    description:
      "Learning facilities providing quality education to communities",
  },
  {
    icon: Sprout,
    value: "2+",
    label: "Community Projects",
    description: "Sustainable initiatives creating lasting positive change",
  },
];

export function Impact() {
  return (
    <section className="bg-secondary py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Impact</h2>
          <p className="text-lg text-gray-600">
            Making a difference, one life at a time
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
            >
              <stat.icon className="mx-auto mb-4 h-12 w-12 text-[#ff6b00]" />
              <h3 className="mb-2 text-2xl font-bold">{stat.value}</h3>
              <p className="mb-2 font-semibold">{stat.label}</p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/donate">
            <Button className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl">
              <Heart className="h-5 w-5" />
              Donate Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
