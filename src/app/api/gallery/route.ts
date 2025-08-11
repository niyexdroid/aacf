import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const image = await prisma.galleryImage.create({
      data: {
        url: data.url,
        caption: data.caption,
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
