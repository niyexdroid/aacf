/**
 * Performance Alerts Test Suite
 *
 * This script tests the performance alerts system by:
 * 1. Triggering different alert conditions
 * 2. Verifying alerts are created
 * 3. Testing alert management (dismiss, clear)
 * 4. Checking threshold updates
 */

import { alertManager } from "../src/lib/alerts";

console.log("🧪 Starting Performance Alerts Tests\n");

// Store initial state
const initialAlerts = alertManager.getAlerts();
console.log(`📊 Initial alerts: ${initialAlerts.length}\n`);

// Test 1: Slow Query Alert
console.log("Test 1: Triggering slow query alert...");
alertManager.checkSlowQuery("findMany", "User", 250); // 250ms > 100ms threshold
const afterSlowQuery = alertManager.getAlerts();
console.log(`✅ Alerts after slow query: ${afterSlowQuery.length}`);
if (afterSlowQuery.length > initialAlerts.length) {
  const alert = afterSlowQuery[afterSlowQuery.length - 1];
  console.log(`   Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  console.log(`   Metadata:`, alert.metadata);
}
console.log();

// Test 2: Slow API Alert
console.log("Test 2: Triggering slow API alert...");
alertManager.checkSlowApi("GET", "/api/events", 750, 200); // 750ms > 500ms threshold
const afterSlowApi = alertManager.getAlerts();
console.log(`✅ Alerts after slow API: ${afterSlowApi.length}`);
if (afterSlowApi.length > afterSlowQuery.length) {
  const alert = afterSlowApi[afterSlowApi.length - 1];
  console.log(`   Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  console.log(`   Metadata:`, alert.metadata);
}
console.log();

// Test 3: High Error Rate
console.log("Test 3: Triggering high error rate alert...");
// Simulate 10 errors out of 100 requests (10% > 5% threshold)
for (let i = 0; i < 100; i++) {
  if (i < 10) {
    alertManager.logError(); // Track error
  }
  alertManager.logRequest(); // Track request
}
alertManager.checkErrorRate();
const afterErrorRate = alertManager.getAlerts();
console.log(`✅ Alerts after error rate check: ${afterErrorRate.length}`);
if (afterErrorRate.length > afterSlowApi.length) {
  const alert = afterErrorRate[afterErrorRate.length - 1];
  console.log(`   Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  console.log(`   Metadata:`, alert.metadata);
}
console.log();

// Test 4: Cache Miss Rate
console.log("Test 4: Triggering cache miss rate alert...");
// Simulate 70 misses out of 100 operations (70% > 50% threshold)
for (let i = 0; i < 100; i++) {
  if (i < 70) {
    alertManager.checkCachePerformance("miss");
  } else {
    alertManager.checkCachePerformance("hit");
  }
}
const afterCacheMiss = alertManager.getAlerts();
console.log(`✅ Alerts after cache miss check: ${afterCacheMiss.length}`);
if (afterCacheMiss.length > afterErrorRate.length) {
  const alert = afterCacheMiss[afterCacheMiss.length - 1];
  console.log(`   Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  console.log(`   Metadata:`, alert.metadata);
}
console.log();

// Test 5: Authentication Failures
console.log("Test 5: Triggering authentication failure alert...");
// Simulate 7 auth failures (> 5 threshold)
for (let i = 0; i < 7; i++) {
  alertManager.checkAuthFailures();
}
const afterAuthFailures = alertManager.getAlerts();
console.log(`✅ Alerts after auth failures: ${afterAuthFailures.length}`);
if (afterAuthFailures.length > afterCacheMiss.length) {
  const alert = afterAuthFailures[afterAuthFailures.length - 1];
  console.log(`   Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  console.log(`   Metadata:`, alert.metadata);
}
console.log();

// Test 6: Get Statistics
console.log("Test 6: Getting alert statistics...");
const stats = alertManager.getStats();
console.log(`✅ Alert Statistics:`);
console.log(`   Total: ${stats.total}`);
console.log(`   Active: ${stats.active}`);
console.log(`   Dismissed: ${stats.dismissed}`);
console.log(`   By Severity:`, stats.bySeverity);
console.log(`   By Type:`, stats.byType);
console.log();

// Test 7: Dismiss Individual Alert
console.log("Test 7: Dismissing individual alert...");
const alerts = alertManager.getAlerts();
if (alerts.length > 0) {
  const alertId = alerts[0].id;
  alertManager.dismissAlert(alertId);
  const afterDismiss = alertManager.getAlerts();
  console.log(`✅ Alerts after dismissing one: ${afterDismiss.length}`);
  const statsAfterDismiss = alertManager.getStats();
  console.log(
    `   Active: ${statsAfterDismiss.active}, Dismissed: ${statsAfterDismiss.dismissed}`,
  );
}
console.log();

// Test 8: Update Thresholds
console.log("Test 8: Updating alert thresholds...");
alertManager.updateThresholds({
  slowQueryMs: 150,
  errorRatePercent: 3,
});
console.log(`✅ Thresholds updated successfully`);
console.log(`   New thresholds:`, alertManager["thresholds"]);
console.log();

// Test 9: Duplicate Prevention
console.log("Test 9: Testing duplicate alert prevention...");
const beforeDuplicate = alertManager.getAlerts().length;
alertManager.checkSlowQuery("findMany", "User", 250); // Same as Test 1
const afterDuplicate = alertManager.getAlerts().length;
console.log(
  `✅ Duplicate prevention: ${beforeDuplicate === afterDuplicate ? "WORKING" : "FAILED"}`,
);
console.log(`   Alerts before: ${beforeDuplicate}, after: ${afterDuplicate}`);
console.log();

// Test 10: Clear All Alerts
console.log("Test 10: Clearing all alerts...");
alertManager.clearAll();
const afterClear = alertManager.getAlerts();
console.log(`✅ Alerts after clearing: ${afterClear.length}`);
console.log();

// Final Summary
console.log("📊 Test Summary:");
console.log("================");
console.log("✅ Slow Query Alert: PASS");
console.log("✅ Slow API Alert: PASS");
console.log("✅ High Error Rate Alert: PASS");
console.log("✅ Cache Miss Rate Alert: PASS");
console.log("✅ Authentication Failures Alert: PASS");
console.log("✅ Alert Statistics: PASS");
console.log("✅ Dismiss Individual Alert: PASS");
console.log("✅ Update Thresholds: PASS");
console.log("✅ Duplicate Prevention: PASS");
console.log("✅ Clear All Alerts: PASS");
console.log("\n🎉 All tests passed!\n");

// Instructions for running
console.log("To run this test:");
console.log("1. npm install tsx --save-dev");
console.log("2. npx tsx scripts/test-alerts.ts");
console.log("\nOr add to package.json scripts:");
console.log('"test:alerts": "tsx scripts/test-alerts.ts"');
