import { initScrollTracking, initTimeTracking, trackEngagement, trackError } from "../lib/analytics";
import { initAllPerformanceMonitoring } from "../lib/performance";

// Expose tracking helpers globally
window.trackEngagement = trackEngagement;
window.trackError = trackError;

// Wait for page to fully load before initializing
window.addEventListener("load", () => {
  initScrollTracking();
  initTimeTracking();
  initAllPerformanceMonitoring();

  if (import.meta.env.DEV) {
    console.log("✅ Analytics & Performance Monitoring Initialized");
  }
});

// Handle page visibility changes
// Track when the user leaves or returns to the page
// so engagement metrics stay accurate across tab switches.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    trackEngagement("page_hidden", 1);
  } else {
    trackEngagement("page_visible", 1);
  }
});

// Global error handler
window.addEventListener("error", (event) => {
  trackError(event.error || event.message, "global_error");
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  trackError(event.reason, "unhandled_rejection");
});
