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

    const { searchParams } = new URL(req.url);
    const severity = searchParams.get("severity");
    const type = searchParams.get("type");
    const includeDismissed = searchParams.get("includeDismissed") === "true";

    let alerts;
    if (severity) {
      alerts = alertManager.getAlertsBySeverity(severity as any);
    } else if (type) {
      alerts = alertManager.getAlertsByType(type as any);
    } else {
      alerts = alertManager.getAlerts(includeDismissed);
    }

    const stats = alertManager.getStats();

    return NextResponse.json({
      alerts,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Alerts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
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

    const { searchParams } = new URL(req.url);
    const alertId = searchParams.get("id");

    if (alertId) {
      // Dismiss specific alert
      const dismissed = alertManager.dismissAlert(alertId);
      if (!dismissed) {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Alert dismissed" });
    } else {
      // Dismiss all alerts
      alertManager.dismissAll();
      return NextResponse.json({
        success: true,
        message: "All alerts dismissed",
      });
    }
  } catch (error) {
    console.error("Alert dismiss error:", error);
    return NextResponse.json(
      { error: "Failed to dismiss alerts" },
      { status: 500 },
    );
  }
}
