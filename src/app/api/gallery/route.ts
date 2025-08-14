import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  try {
    if (!data.url || !data.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    // If eventId optional but schema requires, fallback to first event or create placeholder? For now require provided.
    if (!data.eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 },
      );
    }
    const image = await prisma.galleryImage.create({
      data: {
        url: data.url,
        title: data.title,
        caption: data.caption || null,
        eventId: data.eventId,
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Error creating gallery image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Error deleting gallery image" },
      { status: 500 },
    );
  }
}
