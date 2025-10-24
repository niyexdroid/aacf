import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logApiRequest } from "@/lib/logger";

export async function GET() {
  const startTime = Date.now();
  let status = 200;

  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    status = 500;
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 },
    );
  } finally {
    logApiRequest("GET", "/api/videos", Date.now() - startTime, status);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  let status = 201;

  try {
    const data = await request.json();

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
    status = 500;
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Error creating video" },
      { status: 500 },
    );
  } finally {
    logApiRequest("POST", "/api/videos", Date.now() - startTime, status);
  }
}
