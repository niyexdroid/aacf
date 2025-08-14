import prisma from "@/lib/prisma";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Latest Stories</h2>
          <p className="text-lg text-gray-600">
            Stay updated with our latest news and impact stories
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="absolute left-4 top-4 rounded bg-[#ff6b00] px-3 py-1 text-sm text-white">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-[#ff6b00]" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[#ff6b00]">
                  {post.title}
                </h3>
                <p className="mb-4 text-gray-600">{post.excerpt}</p>
                <Button
                  variant="outline"
                  className="text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
                >
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
