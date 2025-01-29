"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Button } from "./ui/Button"

const blogPosts = [
  {
    title: "Making a Difference: Our Journey in 2023",
    date: "January 15, 2024",
    excerpt: "Looking back at the incredible impact we've made together in communities across the globe.",
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=3270&auto=format&fit=crop",
    category: "Impact Stories"
  },
  {
    title: "Volunteer Stories: Meet Sarah from Kenya",
    date: "January 10, 2024",
    excerpt: "Discover how one volunteer's dedication is transforming lives in rural communities.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop",
    category: "Volunteer Spotlight"
  },
  {
    title: "Building Schools: A Path to Better Future",
    date: "January 5, 2024",
    excerpt: "How our education initiatives are creating lasting change in developing regions.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=3270&auto=format&fit=crop",
    category: "Projects"
  }
]

export function Blog() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Latest Stories</h2>
          <p className="text-lg text-gray-600">Stay updated with our latest news and impact stories</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 rounded bg-[#ff6b00] px-3 py-1 text-sm text-white">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-[#ff6b00]" />
                  <span>{post.date}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[#ff6b00]">
                  {post.title}
                </h3>
                <p className="mb-4 text-gray-600">
                  {post.excerpt}
                </p>
                <Button 
                  variant="outline"
                  className="text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
                >
                  Read More
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            className="bg-[#ff6b00] text-white hover:bg-[#ff6b00]/90"
          >
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  )
}
