import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logApiRequest } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  let status = 201;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();

    if (!data.url || !data.title) {
      status = 400;
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    // If eventId optional but schema requires, fallback to first event or create placeholder? For now require provided.
    if (!data.eventId) {
      status = 400;
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
    status = 500;
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Error creating gallery image" },
      { status: 500 },
    );
  } finally {
    logApiRequest("POST", "/api/gallery", Date.now() - startTime, status);
  }
}

export async function DELETE(request: Request) {
  const startTime = Date.now();
  let status = 200;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      status = 400;
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    status = 500;
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Error deleting gallery image" },
      { status: 500 },
    );
  } finally {
    logApiRequest("DELETE", "/api/gallery", Date.now() - startTime, status);
  }
}
