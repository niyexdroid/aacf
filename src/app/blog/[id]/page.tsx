import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Calendar, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface BlogPostProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

async function getBlogPost(id: string) {
  try {
    const post = await prisma.blog.findUnique({
      where: { id },
    });
    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: post.image
              ? `url(${post.image})`
              : "url('/hero-contact-bg.jpg')",
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 via-orange-800/50 to-red-800/70" />

        {/* Content */}
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-orange-500 px-4 py-2 text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold drop-shadow-lg md:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>AAC Foundation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/blog">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg prose-gray max-w-none">
              {/* Excerpt */}
              <div className="mb-8 rounded-lg bg-orange-50 p-6">
                <p className="text-xl font-medium italic text-orange-900">
                  {post.excerpt}
                </p>
              </div>

              {/* Main Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
              />
            </article>

            {/* Call to Action */}
            <div className="mt-12 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold">
                  Want to Get Involved?
                </h3>
                <p className="mb-6 text-lg">
                  Join us in making a difference in people's lives. Every
                  contribution counts.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/contact">
                    <Button className="bg-white text-orange-600 hover:bg-gray-100">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-orange-600"
                    >
                      View Events
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <h3 className="mb-8 text-2xl font-bold text-gray-900">
                More Stories
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Link href="/blog" className="group">
                  <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl">
                    <div className="p-6">
                      <h4 className="mb-2 text-lg font-semibold group-hover:text-orange-500">
                        Read More Stories
                      </h4>
                      <p className="text-gray-600">
                        Discover more inspiring stories and updates from our
                        foundation.
                      </p>
                    </div>
                  </div>
                </Link>
                <Link href="/events" className="group">
                  <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl">
                    <div className="p-6">
                      <h4 className="mb-2 text-lg font-semibold group-hover:text-orange-500">
                        Upcoming Events
                      </h4>
                      <p className="text-gray-600">
                        Join us at our upcoming events and activities.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
