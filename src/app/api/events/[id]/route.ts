import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { logApiRequest } from "@/lib/logger";

export const dynamic = "force-dynamic";

// In Next.js newer versions params may be passed as a Promise; resolve explicitly.
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  const startTime = Date.now();
  let status = 200;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const resolved =
      "then" in (context.params as any)
        ? await (context.params as Promise<{ id: string }>)
        : (context.params as { id: string });
    const { id } = resolved;
    const body = await req.json();
    const { title, description, date, time, location, image } = body;
    if (!id) {
      status = 400;
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (image !== undefined) updateData.image = image;
    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(event);
  } catch (e) {
    status = 500;
    console.error("PATCH /api/events/[id] error", e);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  } finally {
    logApiRequest("PATCH", "/api/events/[id]", Date.now() - startTime, status);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  let status = 200;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    status = 500;
    console.error("DELETE /api/events/[id] error", e);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  } finally {
    logApiRequest("DELETE", "/api/events/[id]", Date.now() - startTime, status);
  }
}
