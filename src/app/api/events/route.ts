import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { logApiRequest } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let status = 200;

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (e) {
    status = 500;
    console.error("GET /api/events error", e);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  } finally {
    logApiRequest("GET", "/api/events", Date.now() - startTime, status);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let status = 201;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, date, time, location, image } = body;
    if (!title || !description || !date || !time || !location) {
      status = 400;
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        image: image || null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (e) {
    status = 500;
    console.error("POST /api/events error", e);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  } finally {
    logApiRequest("POST", "/api/events", Date.now() - startTime, status);
  }
}
