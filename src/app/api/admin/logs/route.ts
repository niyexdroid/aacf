import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const level = searchParams.get("level");

    let logs;
    if (level) {
      logs = logger.getLogsByLevel(level as any, limit);
    } else {
      logs = logger.getLogs(limit);
    }

    const stats = logger.getStats();

    return NextResponse.json({
      logs,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.clear();

    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    console.error("Logs clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
