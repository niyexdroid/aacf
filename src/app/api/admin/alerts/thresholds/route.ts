import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import alertManager from "@/lib/alerts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thresholds = alertManager.getThresholds();

    return NextResponse.json({
      thresholds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Thresholds fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch thresholds" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      slowQueryMs,
      slowApiMs,
      errorRatePercent,
      cacheMissRatePercent,
      authFailureCount,
    } = body;

    // Validate thresholds
    const updates: any = {};
    if (slowQueryMs !== undefined && slowQueryMs > 0) {
      updates.slowQueryMs = slowQueryMs;
    }
    if (slowApiMs !== undefined && slowApiMs > 0) {
      updates.slowApiMs = slowApiMs;
    }
    if (
      errorRatePercent !== undefined &&
      errorRatePercent > 0 &&
      errorRatePercent <= 100
    ) {
      updates.errorRatePercent = errorRatePercent;
    }
    if (
      cacheMissRatePercent !== undefined &&
      cacheMissRatePercent > 0 &&
      cacheMissRatePercent <= 100
    ) {
      updates.cacheMissRatePercent = cacheMissRatePercent;
    }
    if (authFailureCount !== undefined && authFailureCount > 0) {
      updates.authFailureCount = authFailureCount;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid thresholds provided" },
        { status: 400 },
      );
    }

    alertManager.setThresholds(updates);
    const newThresholds = alertManager.getThresholds();

    return NextResponse.json({
      success: true,
      message: "Thresholds updated",
      thresholds: newThresholds,
    });
  } catch (error) {
    console.error("Thresholds update error:", error);
    return NextResponse.json(
      { error: "Failed to update thresholds" },
      { status: 500 },
    );
  }
}
