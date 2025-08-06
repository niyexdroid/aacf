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
        <h2 className="mb-16 text-center text-3xl font-bold">Our Impact</h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex cursor-pointer flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <stat.icon className="mb-4 h-12 w-12 text-[#ff6b00] transition-transform group-hover:scale-110" />
              <div className="mb-2 text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="mb-2 font-medium">{stat.label}</div>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Donate CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Ready to Make an Impact?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Your donation can help us reach more people and create lasting
            change in communities around the world.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link href="/donate">
              <Button className="flex items-center gap-2 bg-[#ff6b00] text-white shadow-lg transition-all duration-300 hover:bg-[#ff6b00]/90 hover:shadow-xl">
                <Heart className="h-5 w-5" />
                Donate Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
