import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logApiRequest } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let status = 200;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (e) {
    status = 500;
    console.error("Error listing gallery images", e);
    return NextResponse.json(
      { error: "Failed to load images" },
      { status: 500 },
    );
  } finally {
    logApiRequest("GET", "/api/gallery-list", Date.now() - startTime, status);
  }
}
