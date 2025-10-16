import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { invalidateCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, excerpt, content, category, image } = body;
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
      },
    });

    // Invalidate blog cache
    invalidateCache("blogs:*");

    return NextResponse.json(blog);
  } catch (e) {
    console.error("PATCH /api/blogs/[id] error", e);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.blog.delete({ where: { id } });

    // Invalidate blog cache
    invalidateCache("blogs:*");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/blogs/[id] error", e);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
