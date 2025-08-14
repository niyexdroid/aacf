import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch all blog posts
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, category, image } = await request.json();

    // Basic validation
    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        excerpt,
        content,
        category,
        image: image || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

// PUT - Update a blog post
export async function PUT(request: NextRequest) {
  try {
    const { id, title, excerpt, content, category, image } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog post ID is required" },
        { status: 400 },
      );
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        category,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog post ID is required" },
        { status: 400 },
      );
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
