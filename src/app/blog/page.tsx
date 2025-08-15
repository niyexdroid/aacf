import prisma from "@/lib/prisma";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="hero-contact-bg absolute inset-0" />
        {/* Overlay for better text readability */}
        <div className="hero-dark-overlay absolute inset-0" />

        {/* Content */}
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold drop-shadow-lg">Our Blog</h1>
          <p className="mx-auto max-w-2xl text-xl drop-shadow-md">
            Stay updated with our latest news, impact stories, and community
            updates
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="mb-4 text-2xl font-semibold text-gray-600">
                No blog posts yet
              </h3>
              <p className="mb-8 text-gray-500">
                Check back soon for inspiring stories and updates!
              </p>
              <Link href="/contact">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Contact Us for Updates
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                          <span className="text-lg font-semibold text-white">
                            AAC Foundation
                          </span>
                        </div>
                      )}
                      <div className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-orange-500">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-gray-600">
                        {post.excerpt}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-orange-500 text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white drop-shadow-lg">
            Stay Connected
          </h2>
          <p className="mb-8 text-xl text-white drop-shadow-md">
            Don't miss our latest updates and inspiring stories
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact">
              <Button className="bg-white font-semibold text-orange-600 hover:bg-gray-100">
                Get Newsletter Updates
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                className="border-2 border-white font-semibold text-white hover:bg-white hover:text-orange-600"
              >
                View Upcoming Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
