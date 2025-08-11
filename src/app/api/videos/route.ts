import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
