import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Events } from "@/components/Events";
import { Volunteer } from "@/components/Volunteer";
import { Testimonials } from "@/components/Testimonials";
import { Blog } from "@/components/Blog";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const events = await getEvents();
  const blogs = await getBlogs();

  return (
    <>
      <Hero />
      <Impact />
      <Events events={events} />
      <Volunteer />
      <Testimonials />
      <Blog blogs={blogs} />
    </>
  );
}

async function getEvents() {
  try {
    const events = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany();
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
