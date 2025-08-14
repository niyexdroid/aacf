import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const video = await prisma.video.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description,
        eventId: data.eventId,
      },
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: "Error creating video" });
  }
}
