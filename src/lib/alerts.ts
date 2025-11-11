/**
 * Performance Alert System
 * Monitors application performance and triggers alerts for issues
 */

import { sendPerformanceAlertEmail } from "./email";

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertType =
  | "slow_query"
  | "high_error_rate"
  | "slow_api"
  | "cache_miss_rate"
  | "authentication_failures"
  | "system";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  dismissed?: boolean;
}

export interface AlertThresholds {
  slowQueryMs: number; // Trigger alert if query > this
  slowApiMs: number; // Trigger alert if API > this
  errorRatePercent: number; // Trigger if error rate > this
  cacheMissRatePercent: number; // Trigger if cache miss > this
  authFailureCount: number; // Trigger if auth failures > this in 5 min
}

class AlertManager {
  private alerts: Alert[] = [];
  private maxAlerts = 100;
  private listeners: Set<(alerts: Alert[]) => void> = new Set();

  // Default thresholds
  private thresholds: AlertThresholds = {
    slowQueryMs: 100,
    slowApiMs: 500,
    errorRatePercent: 5,
    cacheMissRatePercent: 50,
    authFailureCount: 5,
  };

  // Track metrics for rate calculations
  private recentErrors: number[] = [];
  private recentRequests: number[] = [];
  private recentCacheHits: number[] = [];
  private recentCacheMisses: number[] = [];
  private recentAuthFailures: number[] = [];
  private readonly windowMs = 5 * 60 * 1000; // 5 minutes

  // Track last email sent time per alert type (for rate limiting)
  private lastEmailSent: Map<AlertType, number> = new Map();
  private readonly emailRateLimitMs = 15 * 60 * 1000; // 15 minutes between emails per alert type

  /**
   * Update alert thresholds
   */
  setThresholds(thresholds: Partial<AlertThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Get current thresholds
   */
  getThresholds(): AlertThresholds {
    return { ...this.thresholds };
  }

  /**
   * Create a new alert
   */
  private createAlert(
    type: AlertType,
    severity: AlertSeverity,
    message: string,
    metadata?: Record<string, any>,
  ) {
    const alert: Alert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      metadata,
      dismissed: false,
    };

    // Check if similar alert exists (within last 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const similarAlert = this.alerts.find(
      (a) =>
        a.type === type &&
        a.message === message &&
        a.timestamp.getTime() > fiveMinutesAgo &&
        !a.dismissed,
    );

    // Don't create duplicate alerts
    if (similarAlert) {
      return;
    }

    this.alerts.unshift(alert);

    // Keep only recent alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts);
    }

    // Notify listeners
    this.notifyListeners();

    // Send email for critical alerts (with rate limiting)
    if (severity === "critical") {
      this.sendCriticalAlertEmail(alert);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const emoji = this.getEmoji(severity);
      console.log(
        `${emoji} ALERT [${severity.toUpperCase()}] ${message}`,
        metadata || "",
      );
    }
  }

  /**
   * Send email for critical alerts (with rate limiting)
   */
  private async sendCriticalAlertEmail(alert: Alert) {
    try {
      const now = Date.now();
      const lastSent = this.lastEmailSent.get(alert.type) || 0;

      // Check rate limit (max 1 email per alert type per 15 minutes)
      if (now - lastSent < this.emailRateLimitMs) {
        console.log(
          `Email rate limit: Skipping email for ${alert.type} (last sent ${Math.round((now - lastSent) / 60000)} minutes ago)`,
        );
        return;
      }

      // Send email
      await sendPerformanceAlertEmail({
        alertType: alert.type,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.timestamp.toISOString(),
        metadata: alert.metadata,
      });

      // Update last sent time
      this.lastEmailSent.set(alert.type, now);

      console.log(`✅ Critical alert email sent for ${alert.type}`);
    } catch (error) {
      console.error("Failed to send alert email:", error);
      // Don't throw - email failures shouldn't break the app
    }
  }

  /**
   * Check for slow database query
   */
  checkSlowQuery(operation: string, table: string, duration: number) {
    if (duration > this.thresholds.slowQueryMs) {
      const severity: AlertSeverity =
        duration > this.thresholds.slowQueryMs * 2 ? "critical" : "warning";
      this.createAlert(
        "slow_query",
        severity,
        `Slow database query detected: ${operation} on ${table}`,
        { operation, table, duration, threshold: this.thresholds.slowQueryMs },
      );
    }
  }

  /**
   * Check for slow API request
   */
  checkSlowApi(method: string, path: string, duration: number, status: number) {
    if (duration > this.thresholds.slowApiMs) {
      const severity: AlertSeverity =
        duration > this.thresholds.slowApiMs * 2 ? "critical" : "warning";
      this.createAlert(
        "slow_api",
        severity,
        `Slow API request detected: ${method} ${path}`,
        {
          method,
          path,
          duration,
          status,
          threshold: this.thresholds.slowApiMs,
        },
      );
    }

    // Track request for error rate calculation
    this.recentRequests.push(Date.now());
    if (status >= 500) {
      this.recentErrors.push(Date.now());
      this.checkErrorRate();
    }

    // Track authentication failures
    if (status === 401) {
      this.recentAuthFailures.push(Date.now());
      this.checkAuthFailures();
    }

    // Clean old data
    this.cleanOldMetrics();
  }

  /**
   * Check cache performance
   */
  checkCachePerformance(operation: "hit" | "miss") {
    if (operation === "hit") {
      this.recentCacheHits.push(Date.now());
    } else {
      this.recentCacheMisses.push(Date.now());
    }

    this.cleanOldMetrics();
    this.checkCacheMissRate();
  }

  /**
   * Check error rate
   */
  private checkErrorRate() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const recentRequestCount = this.recentRequests.filter(
      (t) => t > windowStart,
    ).length;
    const recentErrorCount = this.recentErrors.filter(
      (t) => t > windowStart,
    ).length;

    if (recentRequestCount < 10) return; // Need at least 10 requests for meaningful rate

    const errorRate = (recentErrorCount / recentRequestCount) * 100;

    if (errorRate > this.thresholds.errorRatePercent) {
      const severity: AlertSeverity =
        errorRate > this.thresholds.errorRatePercent * 2
          ? "critical"
          : "warning";
      this.createAlert(
        "high_error_rate",
        severity,
        `High error rate detected: ${errorRate.toFixed(1)}%`,
        {
          errorRate: errorRate.toFixed(1),
          errors: recentErrorCount,
          requests: recentRequestCount,
          threshold: this.thresholds.errorRatePercent,
        },
      );
    }
  }

  /**
   * Check cache miss rate
   */
  private checkCacheMissRate() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const recentHits = this.recentCacheHits.filter(
      (t) => t > windowStart,
    ).length;
    const recentMisses = this.recentCacheMisses.filter(
      (t) => t > windowStart,
    ).length;
    const totalCacheOps = recentHits + recentMisses;

    if (totalCacheOps < 10) return; // Need at least 10 operations

    const missRate = (recentMisses / totalCacheOps) * 100;

    if (missRate > this.thresholds.cacheMissRatePercent) {
      this.createAlert(
        "cache_miss_rate",
        "warning",
        `High cache miss rate: ${missRate.toFixed(1)}%`,
        {
          missRate: missRate.toFixed(1),
          hits: recentHits,
          misses: recentMisses,
          threshold: this.thresholds.cacheMissRatePercent,
        },
      );
    }
  }

  /**
   * Check authentication failures
   */
  private checkAuthFailures() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const recentFailures = this.recentAuthFailures.filter(
      (t) => t > windowStart,
    ).length;

    if (recentFailures > this.thresholds.authFailureCount) {
      this.createAlert(
        "authentication_failures",
        "warning",
        `Multiple authentication failures detected: ${recentFailures} in 5 minutes`,
        {
          failures: recentFailures,
          threshold: this.thresholds.authFailureCount,
          possibleBruteForce: recentFailures > 10,
        },
      );
    }
  }

  /**
   * Clean old metrics outside the time window
   */
  private cleanOldMetrics() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    this.recentRequests = this.recentRequests.filter((t) => t > windowStart);
    this.recentErrors = this.recentErrors.filter((t) => t > windowStart);
    this.recentCacheHits = this.recentCacheHits.filter((t) => t > windowStart);
    this.recentCacheMisses = this.recentCacheMisses.filter(
      (t) => t > windowStart,
    );
    this.recentAuthFailures = this.recentAuthFailures.filter(
      (t) => t > windowStart,
    );
  }

  /**
   * Get all alerts
   */
  getAlerts(includesDismissed: boolean = false): Alert[] {
    if (includesDismissed) {
      return [...this.alerts];
    }
    return this.alerts.filter((a) => !a.dismissed);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: AlertSeverity): Alert[] {
    return this.alerts.filter((a) => a.severity === severity && !a.dismissed);
  }

  /**
   * Get alerts by type
   */
  getAlertsByType(type: AlertType): Alert[] {
    return this.alerts.filter((a) => a.type === type && !a.dismissed);
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  /**
   * Dismiss all alerts
   */
  dismissAll() {
    this.alerts.forEach((a) => (a.dismissed = true));
    this.notifyListeners();
  }

  /**
   * Clear all alerts
   */
  clearAll() {
    this.alerts = [];
    this.notifyListeners();
  }

  /**
   * Get alert statistics
   */
  getStats() {
    const active = this.alerts.filter((a) => !a.dismissed);

    return {
      total: this.alerts.length,
      active: active.length,
      dismissed: this.alerts.length - active.length,
      bySeverity: {
        info: active.filter((a) => a.severity === "info").length,
        warning: active.filter((a) => a.severity === "warning").length,
        critical: active.filter((a) => a.severity === "critical").length,
      },
      byType: {
        slow_query: active.filter((a) => a.type === "slow_query").length,
        slow_api: active.filter((a) => a.type === "slow_api").length,
        high_error_rate: active.filter((a) => a.type === "high_error_rate")
          .length,
        cache_miss_rate: active.filter((a) => a.type === "cache_miss_rate")
          .length,
        authentication_failures: active.filter(
          (a) => a.type === "authentication_failures",
        ).length,
        system: active.filter((a) => a.type === "system").length,
      },
    };
  }

  /**
   * Subscribe to alert updates
   */
  subscribe(listener: (alerts: Alert[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.getAlerts());
    });
  }

  /**
   * Get emoji for severity
   */
  private getEmoji(severity: AlertSeverity): string {
    const emojis: Record<AlertSeverity, string> = {
      info: "ℹ️",
      warning: "⚠️",
      critical: "🚨",
    };
    return emojis[severity];
  }
}

// Singleton instance
const alertManager = new AlertManager();

// Log initialization
if (process.env.NODE_ENV === "development") {
  console.log("🚨 Alert Manager initialized");
}

export default alertManager;
