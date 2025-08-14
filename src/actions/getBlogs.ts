"use server";

import prisma from "@/lib/prisma";

export async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany();
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
